using Sequel::CoreRefinements

class Company < Sequel::Model
  extend Carrierwave::Base64::Adapter

  include Company::BBC

  REFERENCES_LIMIT = 4

  module Type
    ENTERPRISE = 'enterprise'.freeze
    AFFILIATE = 'affiliate'.freeze
    BBC = 'bbc'.freeze

    GENERAL_TYPES = [ENTERPRISE, AFFILIATE].freeze
    ENTERPRISE_TYPES = [ENTERPRISE, BBC].freeze
    ALL_TYPES = [ENTERPRISE, AFFILIATE, BBC].freeze
  end

  module CreditRateStatus
    NA = 'na'.freeze
    OK = 'ok'.freeze
    BAD_CREDIT = 'bad_credit'.freeze
    BANKRUPTCY = 'bankruptcy'.freeze
    LIQUIDATION = 'liquidation'.freeze
    CCJ = 'ccj'.freeze
    UNABLE_TO_CHECK = 'unable_to_check'.freeze

    LIQUIDATION_STATUSES = [
      BANKRUPTCY,
      LIQUIDATION,
      CCJ
    ].freeze
  end

  GENERAL_SPECIAL_REQUIREMENTS_KEYS = %w[
    meet_and_greet nameboard_required
  ].freeze

  plugin :application_model
  plugin :association_dependencies
  plugin :association_pks
  plugin :def_dataset_method
  plugin :boolean_readers

  plugin :audited,
    values: [
      :company_type, :multiple_booking, :default_driver_message,
      :gett_business_id, :ot_username, :ot_client_number, :active,
      :booker_notifications, :booker_notifications_emails,
      :critical_flag_due_on
    ]

  subset :active, active: true
  subset :enterprise, company_type: Type::ENTERPRISE

  one_to_one :admin, class: 'Member' do |ds|
    ds.select_all(:users)
      .join(:roles, id: :member_role_id)
      .where{ roles[:name] =~ 'companyadmin' }
  end

  one_to_many :passengers, class: 'Member'

  one_to_many :bookers, class: 'Member' do |ds|
    ds.select_all(:users)
      .join(:roles, id: :member_role_id)
      .where{ roles[:name] =~ %w(admin companyadmin booker finance travelmanager) }
  end

  one_to_many :financiers, class: 'Member' do |ds|
    ds.where(member_role_id: Role[:finance].id)
  end

  one_to_many :members
  one_to_many :internal_messages, class: 'Message'
  one_to_one :company_info, conditions: {active: true}
  one_to_many :company_infos

  many_to_many :bookings, join_table: :company_infos, right_key: :id, right_primary_key: :company_info_id

  one_to_one :payment_options
  one_to_many :invoices
  one_to_many :payment_cards
  one_to_one :payment_card, conditions: {active: true}
  one_to_many :booking_references, order: :priority

  one_to_one :primary_contact, class: 'Contact', conditions: {active: true, primary: true}
  one_to_one :billing_contact, class: 'Contact', conditions: {active: true, primary: false}

  one_to_many :work_roles
  one_to_many :departments
  one_to_many :travel_reasons
  one_to_many :travel_rules
  one_to_many :pricing_rules
  one_to_many :locations
  one_to_many :comments, class: 'CompanyComment'
  one_to_one :default_location, class: 'Location', conditions: {default: true}

  one_to_many :credit_rates, class: 'CompanyCreditRate'
  one_to_one :credit_rate, class: 'CompanyCreditRate', conditions: { active: true }

  one_to_many :csv_reports
  many_to_many :linked_companies, join_table: :company_links, class: self, delay_pks: :always
  many_to_one :ddi

  one_to_one :direct_debit_mandate

  many_to_many :special_requirements

  add_association_dependencies(
    members:              :destroy,
    payment_options:      :delete,
    booking_references:   :destroy,
    company_infos:        :delete,
    primary_contact:      :delete,
    billing_contact:      :delete,
    work_roles:           :destroy,
    departments:          :destroy,
    locations:            :delete,
    payment_cards:        :destroy,
    travel_reasons:       :destroy,
    travel_rules:         :destroy,
    linked_companies:     :nullify,
    direct_debit_mandate: :destroy
  )

  mount_base64_uploader :logo, ImageUploader, file_name: proc { "logo-#{Time.current.to_i}" }

  dataset_module do
    subset :enterprise, company_type: Type::ENTERPRISE
    subset :bbc, company_type: Type::BBC
    subset :with_credit_rate, ~{credit_rate_registration_number: ''}
  end

  delegate :name, :vat_number, :account_number, :sort_code, :cost_centre,
    :legal_name, :salesman, :address, :legal_address, :salesman_id, :account_manager, :account_manager_id,
    :booking_fee, :run_in_fee, :handling_fee, :phone_booking_fee, :tips,
    :cancellation_before_arrival_fee, :cancellation_after_arrival_fee, :gett_cancellation_before_arrival_fee,
    :gett_cancellation_after_arrival_fee, :get_e_cancellation_before_arrival_fee,
    :get_e_cancellation_after_arrival_fee, :international_booking_fee, :system_fx_rate_increase_percentage,
    :splyt_cancellation_before_arrival_fee, :splyt_cancellation_after_arrival_fee,
    :carey_cancellation_before_arrival_fee, :carey_cancellation_after_arrival_fee,
    :quote_price_increase_percentage, :quote_price_increase_pounds, :country_code,
    to: :company_info, allow_nil: true

  delegate :email, to: :account_manager, prefix: true, allow_nil: true

  delegate :affiliate?, :bbc?, to: :company_type, allow_nil: true
  delegate :payment_types, :invoicing_schedule, :payment_terms, :with_periodic_payment_type?,
    to: :payment_options, allow_nil: true
  delegate :phone, :type, to: :ddi, prefix: true, allow_nil: true

  def enterprise?
    company_type.in?([Type::ENTERPRISE, Type::BBC])
  end

  def exactly_enterprise?
    company_type == Type::ENTERPRISE
  end

  def validate
    super
    validates_presence(:gett_business_id)
    validates_presence([:ot_username, :ot_client_number]) if enterprise?
    validates_max_length(4, :booking_references)
    validates_max_length(100, :default_driver_message, allow_nil: true)
    validates_comma_separated_emails(:booker_notifications_emails)

    validate_custom_attributes
  end

  def company_type
    super&.inquiry
  end

  def customer_care_password_required?
    customer_care_password.present?
  end

  def service_suspended?
    invoices_dataset.expired.any?
  end

  def destroyable?
    self[:bookings_count].present? ? self[:bookings_count].zero? : bookings_dataset.empty?
  end

  def api_key
    admin.api_key&.key
  end

  def direct_debit_set_up?
    direct_debit_mandate&.active?
  end

  def human_credit_rate_status
    return 'CCJ' if credit_rate_status == CreditRateStatus::CCJ
    return 'N/A' if credit_rate_status == CreditRateStatus::NA

    credit_rate_status.titleize
  end

  def outstanding_balance
    invoices_dataset.not_fully_paid
      .get{ sum(:amount_cents) - sum(:paid_amount_cents) } || 0
  end

  def raw_passengers_dataset
    DB[:members].where(company_id: id)
  end

  def special_requirements_for(service_provider)
    if service_provider.to_sym == Bookings::Providers::OT
      return special_requirements.map { |sr| sr.values.slice(:key, :label) }
    end

    GENERAL_SPECIAL_REQUIREMENTS_KEYS.map do |key|
      { key: key, label: I18n.t("booking.special_requirements.#{key}") }
    end
  end

  def critical?
    !!critical_flag_due_on&.future?
  end

  def critical_flag_enabled_by
    return unless critical?

    last_critical_flag_changed_version.username
  end

  def critical_flag_enabled_at
    return unless critical?

    last_critical_flag_changed_version.created_at
  end

  def price_with_fx_rate_increase(price, international: false)
    return price unless international

    (price * (1 + system_fx_rate_increase_percentage / 100)).round
  end

  private def last_critical_flag_changed_version
    @last_critical_flag_changed_version ||= versions_dataset
      .where(event: ['create', 'update'])
      .where(Sequel.ilike(:changed, '%critical_flag_due_on%'))
      .order(:created_at)
      .last
  end

  private def validate_custom_attributes
    if custom_attributes.present? && !bbc?
      errors.add(:base, 'custom_attributes forbidden')
    end
  end
end

# Table: companies
# Columns:
#  id                              | integer                     | PRIMARY KEY DEFAULT nextval('companies_id_seq'::regclass)
#  active                          | boolean                     | NOT NULL DEFAULT true
#  destination_required            | boolean                     | DEFAULT false
#  booking_reference_required      | boolean                     | DEFAULT false
#  booking_reference_validation    | boolean                     | DEFAULT false
#  created_at                      | timestamp without time zone | NOT NULL
#  updated_at                      | timestamp without time zone | NOT NULL
#  logo                            | text                        |
#  company_type                    | company_type                | NOT NULL DEFAULT 'enterprise'::company_type
#  gett_business_id                | text                        | NOT NULL
#  ot_username                     | text                        |
#  ot_client_number                | text                        |
#  default_driver_message          | text                        |
#  multiple_booking                | boolean                     | NOT NULL DEFAULT true
#  fake                            | boolean                     | NOT NULL DEFAULT false
#  payroll_required                | boolean                     | DEFAULT false
#  cost_centre_required            | boolean                     | DEFAULT false
#  customer_care_password          | text                        |
#  hr_feed_enabled                 | boolean                     | NOT NULL DEFAULT false
#  sftp_username                   | text                        |
#  sftp_password                   | text                        |
#  marketing_allowed               | boolean                     | NOT NULL DEFAULT false
#  bookings_validation_enabled     | boolean                     | NOT NULL DEFAULT false
#  api_enabled                     | boolean                     | NOT NULL DEFAULT false
#  sap_id                          | text                        |
#  booker_notifications_emails     | text                        |
#  booker_notifications            | boolean                     | NOT NULL DEFAULT true
#  credit_rate_registration_number | text                        |
#  credit_rate_incorporated_at     | date                        |
#  credit_rate_status              | text                        | NOT NULL DEFAULT 'na'::text
#  ddi_id                          | integer                     | NOT NULL
#  custom_attributes               | hstore                      |
#  allow_preferred_vendor          | boolean                     | DEFAULT false
#  critical_flag_due_on            | date                        |
# Indexes:
#  companies_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  companies_ddi_id_fkey | (ddi_id) REFERENCES ddis(id)
# Referenced By:
#  booking_references             | booking_references_company_id_fkey             | (company_id) REFERENCES companies(id)
#  company_infos                  | company_infos_company_id_fkey                  | (company_id) REFERENCES companies(id)
#  contacts                       | contacts_company_id_fkey                       | (company_id) REFERENCES companies(id)
#  departments                    | departments_company_id_fkey                    | (company_id) REFERENCES companies(id)
#  members                        | members_company_id_fkey                        | (company_id) REFERENCES companies(id)
#  messages                       | messages_company_id_fkey                       | (company_id) REFERENCES companies(id)
#  payment_cards                  | payment_cards_company_id_fkey                  | (company_id) REFERENCES companies(id)
#  payment_options                | payment_options_company_id_fkey                | (company_id) REFERENCES companies(id)
#  travel_reasons                 | travel_reasons_company_id_fkey                 | (company_id) REFERENCES companies(id)
#  travel_rules                   | travel_rules_company_id_fkey                   | (company_id) REFERENCES companies(id)
#  work_roles                     | work_roles_company_id_fkey                     | (company_id) REFERENCES companies(id)
#  locations                      | locations_company_id_fkey                      | (company_id) REFERENCES companies(id)
#  csv_reports                    | csv_reports_company_id_fkey                    | (company_id) REFERENCES companies(id)
#  company_links                  | company_links_company_id_fkey                  | (company_id) REFERENCES companies(id)
#  company_links                  | company_links_linked_company_id_fkey           | (linked_company_id) REFERENCES companies(id)
#  comments                       | comments_company_id_fkey                       | (company_id) REFERENCES companies(id)
#  direct_debit_mandates          | direct_debit_mandates_company_id_fkey          | (company_id) REFERENCES companies(id)
#  company_credit_rates           | company_credit_rates_company_id_fkey           | (company_id) REFERENCES companies(id)
#  companies_special_requirements | companies_special_requirements_company_id_fkey | (company_id) REFERENCES companies(id)
#  pricing_rules                  | pricing_rules_company_id_fkey                  | (company_id) REFERENCES companies(id)
