using Sequel::CoreRefinements

class Booking < Sequel::Model
  include Booking::BBC
  include Booking::SplytExtension

  # All available booking statuses:
  # - creating
  # - order_received
  # - processing
  # - locating
  # - on_the_way
  # - arrived
  # - in_progress
  # - completed
  # - cancelled
  # - rejected
  # - customer_care

  LIVE_STATUSES = ['locating', 'arrived', 'on_the_way', 'in_progress'].freeze
  ACTIVE_STATUSES = ['creating', *LIVE_STATUSES].freeze
  FINAL_STATUSES = ['completed', 'cancelled', 'rejected'].freeze
  ON_CUSTOMER_CARE_STATUSES = ['customer_care'].freeze
  UNCANCELLABLE_STATUSES = ['in_progress', *FINAL_STATUSES].freeze
  FUTURE_STATUSES = ['order_received'].freeze
  WITH_DRIVER_STATUSES = ['arrived', 'on_the_way', 'in_progress'].freeze
  BILLABLE_STATUSES = ['completed', 'cancelled'].freeze
  ALERT_STATUSES = ['processing', 'customer_care'].freeze
  STANDARD_EDITABLE_INTERVAL = 30.minutes
  CAREY_EDITABLE_INTERVAL = 2.hours
  INTERNATIONAL_SERVICE_TYPES = ['get_e'].freeze

  CREDIT_PAYMENTS = [
    PaymentOptions::PaymentType::PERSONAL_PAYMENT_CARD,
    PaymentOptions::PaymentType::BUSINESS_PAYMENT_CARD
  ].freeze
  IMMEDIATE_PAYMENTS = [PaymentOptions::PaymentType::CASH, *CREDIT_PAYMENTS].freeze
  PERIODIC_PAYMENTS = [
    PaymentOptions::PaymentType::ACCOUNT,
    PaymentOptions::PaymentType::COMPANY_PAYMENT_CARD,
    PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC
  ].freeze
  ALLOWED_PAYMENTS = [
    *PERIODIC_PAYMENTS,
    *IMMEDIATE_PAYMENTS
  ].freeze

  CANCELLATION_REASONS = %w(mistaken_order driver_asked_to hailed_another_car too_long_eta).freeze

  module SourceType
    WEB = 'web'.freeze
    WEB_MOBILE = 'web_mobile'.freeze
    MOBILE_APP = 'mobile_app'.freeze
    API = 'api'.freeze

    INTERNAL_TYPES = [WEB, WEB_MOBILE, MOBILE_APP].freeze
    EXTERNAL_TYPES = [API].freeze
  end

  plugin :application_model
  plugin :boolean_readers
  plugin :defaults_setter
  plugin :dirty
  plugin :optimistic_locking
  plugin :instance_hooks
  plugin :association_pks
  plugin :association_dependencies
  plugin :def_dataset_method
  plugin :audited,
    on: :update,
    values: [
      :status, :flight, :message, :payment_method, :scheduled_at, :critical_flag
    ],
    many_to_one: [:vehicle]

  delegate :company_type, to: :company
  delegate :critical?, to: :company, prefix: true
  delegate :service_type, :earliest_available_in, to: :vehicle, allow_nil: true
  Bookings::Providers::ALL.each do |provider|
    delegate "#{provider}?".to_sym, to: :vehicle, allow_nil: true
  end
  delegate :creating?, :order_received?, :processing?, :locating?, :on_the_way?, :arrived?,
    :in_progress?, :completed?, :cancelled?, :rejected?, :customer_care?, to: :status

  delegate :total_cost, to: :charges, allow_nil: true
  delegate :key, to: :vehicle_vendor, prefix: true, allow_nil: true

  dataset_module do
    subset :active, status: ACTIVE_STATUSES
    subset :final, status: FINAL_STATUSES
    subset :not_final, ~{status: FINAL_STATUSES}
    subset :customer_care, status: ON_CUSTOMER_CARE_STATUSES
    subset :not_customer_care, ~{status: ON_CUSTOMER_CARE_STATUSES}
    subset(:fully_created) { (status !~ 'creating') & (service_id !~ nil) }
    subset :with_flight, ~{flight: nil}
    subset :scheduled, asap: false
    subset :asap, asap: true
    subset :completed, status: 'completed'
    subset :live, status: LIVE_STATUSES
    subset :future, status: FUTURE_STATUSES
    subset :cancelled, status: 'cancelled'
    subset :rejected, status: 'rejected'
    subset :credit, payment_method: CREDIT_PAYMENTS
    subset :cash, payment_method: PaymentOptions::PaymentType::CASH
    subset :account, payment_method: PaymentOptions::PaymentType::ACCOUNT
    subset :periodic_payments, payment_method: PERIODIC_PAYMENTS
    subset :billable, status: BILLABLE_STATUSES
    subset :ftr, ftr: true
    subset :billed, billed: true

    def provided_by(provider)
      association_join(:vehicle.as(:vehicles))
        .where(:vehicles[:service_type] => provider)
        .select(:bookings.*)
    end

    def international
      association_join(:pickup_address)
        .exclude(:pickup_address[:country_code] => Bookings::DOMESTIC_ORDER_COUNTRY_CODES)
        .select(:bookings.*)
    end

    def critical
      association_join(:company)
        .where do
          (:bookings[:critical_flag] =~ true) |
          (:bookings[:international_flag] =~ true) |
          (:bookings[:vip] =~ true) |
          (:company[:critical_flag_due_on] > Date.current)
        end
        .select(:bookings.*)
    end

    def not_manually_charged
      left_join(:booking_charges, booking_id: :bookings[:id])
        .where(:booking_charges[:manual] !~ true)
        .select(:bookings.*)
    end

    Bookings::Providers::ALL.each do |provider|
      define_method(provider) do
        provided_by(provider.to_s)
      end
    end
  end

  many_to_one :company_info
  one_through_one :company,
    join_table:       :company_infos,
    left_key:         :id,
    left_primary_key: :company_info_id,
    right_key:        :company_id
  many_to_one :booker, class: 'User'
  many_to_one :passenger, class: 'Member'
  many_to_one :cancelled_by, class: 'User'
  many_to_one :vehicle
  many_to_one :vehicle_vendor
  many_to_one :travel_reason
  many_to_one :payment_card
  many_to_one :schedule, foreign_key: :schedule_id, class: 'BookingSchedule'
  one_to_many :booker_references
  one_to_many :alerts
  one_to_many :comments, class: 'BookingComment'

  one_to_many :booking_addresses
  one_through_one :pickup_address,
    class:      'Address',
    join_table: :booking_addresses,
    left_key:   :booking_id,
    right_key:  :address_id,
    conditions: { :booking_addresses[:address_type] => 'pickup' },
    select:     [:addresses.*, :booking_addresses[:passenger_address_type].as(:passenger_address_type)]

  one_through_one :destination_address,
    class:      'Address',
    join_table: :booking_addresses,
    left_key:   :booking_id,
    right_key:  :address_id,
    conditions: { :booking_addresses[:address_type] => 'destination' },
    select:     [:addresses.*, :booking_addresses[:passenger_address_type].as(:passenger_address_type)]

  many_to_many :stop_addresses,
    class:      'Address',
    join_table: :booking_addresses,
    select:     [:addresses.*, :booking_addresses[:stop_info], :booking_addresses[:passenger_address_type].as(:passenger_address_type)],
    left_key:   :booking_id,
    right_key:  :address_id,
    order:      :booking_addresses[:id],
    conditions: { :booking_addresses[:address_type] => 'stop' }

  one_to_many :payments
  one_to_one :driver, class: 'BookingDriver'
  one_to_many :feedbacks
  one_to_one :charges, class: 'BookingCharges'
  many_to_many :invoices, delay_pks: :always

  add_association_dependencies(
    booking_addresses: :destroy,
    driver: :destroy,
    charges: :destroy,
    payments: :destroy
  )

  def before_update
    if recurring_next? && column_changed?(:status) && initial_value(:status) == 'order_received'
      self.recurring_next = false
      db.after_commit { SpawnRecurringBooking.perform_async(id) } unless suppress_recurring?
    end
    super
  end

  def fare_quote
    pricing_rule_fare_quote || super
  end

  private def after_create
    super
    # NOTE: in real world scenario booking creation is always followed by creation of
    # other records - booking addresses, etc, which have their own hooks that will
    # eventually update booking indexes. in this hook, only "placeholder" for indexes
    # is created, since no other meaningfull information can be fetched having booking
    # alone.
    DB[:booking_indexes].insert([:booking_id], [id])
  end

  private def after_update
    super
    refresh_indexes
  end

  private def before_destroy
    super
    DB[:booking_indexes].where(booking_id: id).delete
  end

  def indexes
    DB[:booking_indexes].first(booking_id: id)
  end

  def refresh_indexes
    DB[:booking_indexes].where(booking_id: id).update(index_values)
  end

  private def index_values
    {
      booking_id:          id,
      service_id:          service_id,
      order_id:            order_id&.downcase,
      local_scheduled_at:  ActiveSupport::TimeZone[timezone].utc_to_local(scheduled_at),
      vendor_name:         vendor_name,
      supplier_service_id: supplier_service_id&.downcase,
      company_id:          company.id,
      passenger_id:        passenger_id,
      passenger_full_name: passenger_info[:full_name]&.downcase
    }
  end

  def build_booking_address(params)
    BookingAddress.new(params.merge(booking: self))
  end

  def validate
    super
    validates_presence(
      %i(company_info_id vehicle booker payment_method scheduled_at status passenger_phone)
    )
    validates_phone_number(:passenger_phone)
    validates_max_length(225, :message, allow_nil: true)
    validate_scheduled_at if future? && scheduled_at.present?
    validates_includes(ALLOWED_PAYMENTS, :payment_method, allow_nil: true)
    validates_presence(:payment_card_id) if payment_method.in?(CREDIT_PAYMENTS)
    validates_presence(:schedule_id) if recurring_next?
    validate_company_payment_card if payment_method == PaymentOptions::PaymentType::COMPANY_PAYMENT_CARD

    if company&.affiliate?
      max_name_length = Sequel::Plugins::ApplicationModel::FULL_NAME_MAX_LENGTH
      max_name_length -= room_label.length if room.present?

      validates_name(:passenger_name, max_length: max_name_length)
    elsif passenger_id.blank?
      validates_name(:passenger_name)
    end

    validate_special_requirements
    validates_includes(CANCELLATION_REASONS, :cancellation_reason, allow_nil: true)
  end

  def before_validation
    super

    return if persisted?

    self.company_info_id ||= booker.try(:company)&.company_info&.id
    self.passenger_phone ||= passenger&.phone
  end

  def order_id
    values.fetch(:order_id) do
      splyt? ? "SP#{id}" : service_id
    end
  end

  def international?
    ::Bookings.international?(pickup_address.country_code)
  end

  def domestic?
    ::Bookings.domestic?(pickup_address.country_code)
  end

  def final?
    status.in?(FINAL_STATUSES)
  end

  def customer_care?
    status.in?(ON_CUSTOMER_CARE_STATUSES)
  end

  def cancellable?
    !status.in?(UNCANCELLABLE_STATUSES)
  end

  def live?
    status.in?(LIVE_STATUSES)
  end

  def rejectable?
    creating?
  end

  def status
    super&.inquiry
  end

  def source_type
    super&.inquiry
  end

  def editable?
    return false if company.affiliate?
    return false if splyt?

    customer_care? || recurring_next? ||
      (!final? && !asap? && scheduled_at >= editable_interval.from_now)
  end

  def future?
    !asap?
  end

  def editable_in_back_office?
    return false if company.affiliate?
    return false if splyt? && !customer_care?

    customer_care? || (payment_method != 'cash' && !billed?)
  end

  def via?
    asap? && domestic? && gett? && vehicle&.standard?
  end

  def flags
    [
      vip? && :vip,
      asap? ? :asap : :future,
      ftr? && :ftr,
      critical_flag? && :critical_flag,
      company_critical? && :critical_company,
      international_flag? && :international_flag
    ].select(&:present?)
  end

  def passenger_info
    if passenger.present?
      {
        first_name: passenger.first_name,
        last_name: passenger.last_name,
        full_name: passenger.full_name,
        phone_number: passenger_phone || passenger.phone,
        email: passenger.email
      }
    else
      {
        first_name: passenger_first_name_label,
        last_name: passenger_last_name,
        full_name: passenger_full_name_label,
        phone_number: passenger_phone
      }
    end
  end

  def passenger_name
    passenger&.full_name || [passenger_first_name, passenger_last_name].select(&:presence).join(' ')
  end

  def passenger_first_name_label
    passenger_first_name.presence || room_label.presence || company_label
  end

  def passenger_full_name_label
    [passenger_name, room_label].select(&:presence).join(', ').presence || company_label
  end

  def room_label
    return if room.blank?

    "Room: #{room}"
  end

  def company_label
    return if company_info.blank?

    "Company: #{company_info.name}"
  end

  def message_to_driver
    flight_text = flight.present? && "Flight: #{flight}"

    requirements_text =
      if company_type.bbc? && !ot?
        special_requirements&.map{ |sr| I18n.t("booking.special_requirements.#{sr}") }
      end

    [flight_text, requirements_text, message].flatten.select(&:present?).join(', ')
  end

  def build_driver(params = {})
    BookingDriver.new(params.merge(booking: self))
  end

  def build_charges(params = {})
    BookingCharges.new(params.merge(booking: self))
  end

  def alert_for(type)
    if associations[:alerts]
      associations[:alerts].find{ |a| a.type == type.to_s }
    else
      alerts_dataset.where(type: type.to_s)
    end
  end

  def timezone
    pickup_address&.timezone || Settings.time_zone
  end

  def suppress_recurring!
    @suppress_recurring = true
  end

  def suppress_recurring?
    !!@suppress_recurring
  end

  # These methods provide fallbacks for cases when we missed a status update
  # and have not recorded the time when the status change occurred.

  def started_at
    super || ended_at
  end

  def arrived_at
    super || started_at
  end

  def allocated_at
    super || arrived_at
  end

  def started_locating_at
    super || allocated_at
  end

  def booked_at
    super || started_locating_at
  end

  def billable?
    status.in?(BILLABLE_STATUSES)
  end

  def as_directed?
    destination_address.blank?
  end

  def indicated_status
    billed? ? 'billed' : status
  end

  def successful_payment
    payments.find(&:successful?)
  end

  def vendor_name
    values.fetch(:vendor_name) do
      case
      when gett?  then gett_vendor_name
      when ot?    then driver&.vendor_name
      when get_e? then ::Bookings::Vendors::GET_E
      when splyt? then supplier
      end
    end
  end

  def vatable?
    !company.bbc?
  end

  def critical_flag_enabled_by
    return unless critical_flag?

    last_critical_flag_changed_version.username
  end

  def critical_flag_enabled_at
    return unless critical_flag?

    last_critical_flag_changed_version.created_at
  end

  def driver_assigned?
    # Gett API populates driver attributes only for active order statuses
    # acc. https://developer.gett.com/docs/business-get-ride-details
    # which results in existing but 'empty' driver for Gett orders
    driver.present? && driver.phone_number.present?
  end

  private def last_critical_flag_changed_version
    @last_critical_flag_changed_version ||= versions_dataset
      .where(event: 'update')
      .where(Sequel.ilike(:changed, '%critical_flag%'))
      .order(:created_at)
      .last
  end

  private def personal_card_ride?
    payment_method == PaymentOptions::PaymentType::PERSONAL_PAYMENT_CARD
  end

  private def black_taxi_ride?
    vehicle&.name&.in?(%w'BlackTaxi BlackTaxiXL')
  end

  private def gett_vendor_name
    case pickup_address.country_code
    when 'RU' then ::Bookings::Vendors::GETT_RU
    when 'IL' then ::Bookings::Vendors::GETT_IL
    else ::Bookings::Vendors::GETT_UK
    end
  end

  private def validate_scheduled_at
    if (new? || column_changed?(:scheduled_at)) && scheduled_at <= nearest_available_scheduled_at
      errors.add(:scheduled_at,
        I18n.t('booking.errors.scheduled_at_less_than_earliest_available', minutes: earliest_available_in)
      )
    end

    if persisted? && column_changed?(:scheduled_at) && initial_value(:scheduled_at).present?
      if [initial_value(:scheduled_at), scheduled_at].min < nearest_available_scheduled_at
        errors.add(:scheduled_at, I18n.t('booking.errors.scheduled_at_change_forbidden'))
      end
    end
  end

  private def nearest_available_scheduled_at
    @nearest_available_scheduled_at ||=
      Time.current + (earliest_available_in || 0).minutes
  end

  private def validate_company_payment_card
    if company.payment_card.blank?
      errors.add(:payment_type, I18n.t('booking.errors.company_payment_card_blank'))
    end
  end

  private def validate_special_requirements
    return if special_requirements.blank?

    allowed_requirements = company.special_requirements_for(service_type)
    allowed_requirements_keys = allowed_requirements.pluck(:key)

    if (special_requirements - allowed_requirements_keys).any?
      errors.add(:special_requiements, I18n.t('booking.errors.invalid_special_requirements'))
    end
  end

  private def recurring?
    schedule_id.present?
  end

  private def editable_interval
    (customer_care? || !vehicle.carey?) ? STANDARD_EDITABLE_INTERVAL : CAREY_EDITABLE_INTERVAL
  end
end

# Table: bookings
# Columns:
#  id                            | integer                     | PRIMARY KEY DEFAULT nextval('bookings_id_seq'::regclass)
#  booker_id                     | integer                     | NOT NULL
#  passenger_id                  | integer                     |
#  passenger_first_name          | text                        |
#  passenger_last_name           | text                        |
#  passenger_phone               | text                        |
#  message                       | text                        |
#  created_at                    | timestamp without time zone | NOT NULL
#  updated_at                    | timestamp without time zone | NOT NULL
#  status                        | booking_status              | NOT NULL DEFAULT 'creating'::booking_status
#  vehicle_id                    | integer                     |
#  travel_reason_id              | integer                     |
#  scheduled_at                  | timestamp without time zone | NOT NULL
#  company_info_id               | integer                     |
#  arrived_at                    | timestamp without time zone |
#  started_at                    | timestamp without time zone |
#  ended_at                      | timestamp without time zone |
#  cancelled_at                  | timestamp without time zone |
#  flight                        | text                        |
#  fare_quote                    | integer                     | NOT NULL DEFAULT 0
#  service_id                    | text                        |
#  payment_method                | payment_type                |
#  cancellation_requested_at     | timestamp without time zone |
#  asap                          | boolean                     | NOT NULL DEFAULT true
#  phone_booking                 | boolean                     | NOT NULL DEFAULT false
#  lock_version                  | integer                     | NOT NULL DEFAULT 0
#  quote_id                      | text                        |
#  ot_confirmation_number        | text                        |
#  ot_job_status                 | text                        |
#  ot_vehicle_state              | text                        |
#  booked_at                     | timestamp without time zone |
#  allocated_at                  | timestamp without time zone |
#  cancelled_by_id               | integer                     |
#  travel_distance               | double precision            |
#  rejected_at                   | timestamp without time zone |
#  started_locating_at           | timestamp without time zone |
#  payment_card_id               | integer                     |
#  ot_waiting_time               | integer                     |
#  status_before_cancellation    | booking_status              |
#  cancellation_fee              | boolean                     | DEFAULT true
#  vip                           | boolean                     | NOT NULL DEFAULT false
#  ftr                           | boolean                     | NOT NULL DEFAULT false
#  cancelled_through_back_office | boolean                     | NOT NULL DEFAULT false
#  customer_care_at              | timestamp without time zone |
#  customer_care_message         | text                        |
#  ot_extra_cost                 | integer                     | NOT NULL DEFAULT 0
#  cancellation_quote            | integer                     | DEFAULT 0
#  schedule_id                   | integer                     |
#  recurring_next                | boolean                     | DEFAULT false
#  international_flag            | boolean                     | DEFAULT false
#  room                          | text                        |
#  source_type                   | booking_source_type         |
#  cancellation_reason           | text                        |
#  special_requirements          | text[]                      | DEFAULT '{}'::text[]
#  vehicle_vendor_id             | integer                     |
#  custom_attributes             | jsonb                       |
#  carey_token                   | text                        |
#  critical_flag                 | boolean                     |
#  supplier_service_id           | text                        |
#  billed                        | boolean                     | NOT NULL DEFAULT false
#  pricing_rule_fare_quote       | integer                     |
# Indexes:
#  bookings_pkey                          | PRIMARY KEY btree (id)
#  bookings_booker_id_index               | btree (booker_id)
#  bookings_company_info_id_index         | btree (company_info_id)
#  bookings_passenger_full_name_index     | gin (concat_space(passenger_first_name, passenger_last_name) gin_trgm_ops)
#  bookings_passenger_id_index            | btree (passenger_id)
#  bookings_scheduled_at_index            | btree (scheduled_at)
#  bookings_service_id_gin_index          | gin (service_id gin_trgm_ops)
#  bookings_service_id_index              | btree (service_id)
#  bookings_status_index                  | btree (status)
#  bookings_supplier_service_id_gin_index | gin (supplier_service_id gin_trgm_ops)
#  bookings_supplier_service_id_index     | btree (supplier_service_id)
#  bookings_vehicle_id_index              | btree (vehicle_id)
# Foreign key constraints:
#  bookings_booker_id_fkey         | (booker_id) REFERENCES users(id)
#  bookings_cancelled_by_id_fkey   | (cancelled_by_id) REFERENCES users(id)
#  bookings_company_info_id_fkey   | (company_info_id) REFERENCES company_infos(id)
#  bookings_passenger_id_fkey      | (passenger_id) REFERENCES users(id)
#  bookings_payment_card_id_fkey   | (payment_card_id) REFERENCES payment_cards(id)
#  bookings_schedule_id_fkey       | (schedule_id) REFERENCES booking_schedules(id)
#  bookings_travel_reason_id_fkey  | (travel_reason_id) REFERENCES travel_reasons(id)
#  bookings_vehicle_id_fkey        | (vehicle_id) REFERENCES vehicles(id)
#  bookings_vehicle_vendor_id_fkey | (vehicle_vendor_id) REFERENCES vehicle_vendors(id)
# Referenced By:
#  booker_references | booker_references_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  booking_addresses | booking_addresses_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  booking_charges   | booking_charges_booking_id_fkey   | (booking_id) REFERENCES bookings(id)
#  booking_drivers   | booking_drivers_booking_id_fkey   | (booking_id) REFERENCES bookings(id)
#  booking_messages  | booking_messages_booking_id_fkey  | (booking_id) REFERENCES bookings(id)
#  comments          | comments_booking_id_fkey          | (booking_id) REFERENCES bookings(id)
#  credit_note_lines | credit_note_lines_booking_id_fkey | (booking_id) REFERENCES bookings(id)
#  feedbacks         | feedbacks_booking_id_fkey         | (booking_id) REFERENCES bookings(id)
#  incomings         | incomings_booking_id_fkey         | (booking_id) REFERENCES bookings(id)
#  payments          | payments_booking_id_fkey          | (booking_id) REFERENCES bookings(id)
#  booking_indexes   | booking_indexes_booking_id_fkey   | (booking_id) REFERENCES bookings(id)
