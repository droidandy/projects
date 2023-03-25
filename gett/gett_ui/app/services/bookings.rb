module Bookings
  ServiceProviderError = Class.new(StandardError)

  module Providers
    GETT   = :gett
    OT     = :ot
    GET_E  = :get_e
    MANUAL = :manual
    CAREY  = :carey
    SPLYT  = :splyt

    ALL           = [GETT, OT, GET_E, MANUAL, CAREY, SPLYT].freeze
    GB            = [GETT, OT, MANUAL].freeze
    IL            = [GETT, SPLYT].freeze
    INTERNATIONAL = [GET_E, MANUAL, CAREY, SPLYT].freeze
    AS_DIRECTED   = [GETT, CAREY].freeze
  end

  module Vendors
    GETT_UK = 'Gett UK'.freeze
    GETT_RU = 'Gett RU'.freeze
    GETT_IL = 'Gett IL'.freeze
    GET_E = 'GetE'.freeze
  end

  TIMESTAMP_MAPPING = {
    creating:       :created_at,
    order_received: :booked_at,
    locating:       :started_locating_at,
    on_the_way:     :allocated_at,
    arrived:        :arrived_at,
    in_progress:    :started_at,
    completed:      :ended_at,
    cancelled:      :cancelled_at,
    rejected:       :rejected_at,
    customer_care:  :customer_care_at
  }.freeze

  API_TYPES = {
    Providers::GETT   => 'Gett',
    Providers::OT     => 'OneTransport',
    Providers::GET_E  => 'GetE',
    Providers::CAREY  => 'Carey',
    Providers::MANUAL => 'Manual',
    Providers::SPLYT  => 'Splyt'
  }.freeze
  WHEELCHAIR_VEHICLES = %w'BlackTaxi BlackTaxiXL OTBlackTaxi OTBlackTaxiXL'.freeze
  CASH_VEHICLES = %w'BlackTaxi BlackTaxiXL'.freeze
  AFFILIATE_VEHICLES = %w'BlackTaxi BlackTaxiXL'.freeze

  ASAP_ONLY_VEHICLES = %w'Porsche'.freeze
  LATER_ONLY_VEHICLES = %w'GettXL Chauffeur'.freeze
  LATER_ONLY_PROVIDERS = %w'ot'.freeze
  AS_DIRECTED_APIS = %i[gett].freeze

  DEFAULT_CANCELLATION_QUOTE = 0
  DEFAULT_CURRENCY = 'GBP'.freeze
  DEFAULT_CURRENCY_COUNTRY_CODE = 'GB'.freeze

  DOMESTIC_ORDER_COUNTRY_CODES = [
    'GB',
    'GG', # Bailiwick of Guernsey
    'JE', # Jersey island
    'IM'  # isle of Man
  ].freeze

  ASAP_DELAY = 6.minutes.freeze

  UPDATER_CLASSES = [
    Bookings::Updaters::Gett,
    Bookings::Updaters::OT,
    Bookings::Updaters::Splyt
  ].freeze
  OPERATIONS = {
    create: 'Create',
    modify: 'Modify',
    cancel: 'Cancel'
  }.freeze
  private_constant :UPDATER_CLASSES, :OPERATIONS

  def self.updater_for(booking)
    UPDATER_CLASSES.reduce(nil) do |memo, klass|
      service = klass.new(booking: booking)
      service.can_execute? ? service : memo
    end
  end

  def self.service_for(booking, method_type)
    api_type = API_TYPES[booking.service_type.to_sym]
    operation = OPERATIONS[method_type]

    service_klass = "#{api_type}::#{operation}".constantize
    service_klass.new(booking: booking)
  end

  def self.domestic?(country_code)
    DOMESTIC_ORDER_COUNTRY_CODES.include?(country_code)
  end

  def self.international?(country_code)
    !domestic?(country_code)
  end
end
