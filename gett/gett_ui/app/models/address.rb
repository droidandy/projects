class Address < Sequel::Model
  LOOKUP_ATTRIBUTES = %i[line lat lng country_code].freeze
  ATTRIBUTES = %i[postal_code city region street_name street_number point_of_interest].unshift(*LOOKUP_ATTRIBUTES).freeze

  plugin :application_model

  many_to_one :airport

  def self.lookup(params)
    return if params.blank?

    find(params.to_h.symbolize_keys.slice(*LOOKUP_ATTRIBUTES))
  end

  def self.fetch(params)
    lookup(params) || new(params)
  end

  def self.lookup_valid!(params, &block)
    params ||= {}

    return with_pk!(params[:id]) if params[:id].present?

    fetch(params).tap do |address|
      address.set_missing(params)
      address.save(&block) if (address.new? && address.valid?) || address.changed_columns.present?
    end
  end

  def validate
    super
    validates_presence(LOOKUP_ATTRIBUTES)
  end

  def before_create
    super
    self.timezone ||= Timezones.timezone_at(self)
  end

  def values
    super.dup.tap do |vals|
      vals[:lat] = vals[:lat].to_f if vals.key?(:lat)
      vals[:lng] = vals[:lng].to_f if vals.key?(:lng)
    end
  end

  def [](column) # rubocop:disable Rails/Delegate
    values[column]
  end

  # almost the same as original one, but compare with `values` method return value
  # TODO: implement a nicer solution for working with BigDecimal's and Float's
  # all over the project
  def eql?(other)
    (other.class == model) && (other.values == values)
  end

  def set_missing(params) # rubocop:disable Naming/AccessorMethodName
    params.to_h.symbolize_keys.each do |attr, value|
      public_send("#{attr}=", value) if self[attr].nil?
    end
  end
end

# Table: addresses
# Columns:
#  id                | integer                     | PRIMARY KEY DEFAULT nextval('addresses_id_seq'::regclass)
#  line              | text                        |
#  lat               | numeric(10,7)               |
#  lng               | numeric(10,7)               |
#  created_at        | timestamp without time zone | NOT NULL
#  updated_at        | timestamp without time zone | NOT NULL
#  postal_code       | text                        |
#  references_count  | integer                     | NOT NULL DEFAULT 0
#  country_code      | text                        | NOT NULL DEFAULT 'GB'::text
#  timezone          | text                        |
#  city              | text                        |
#  airport_id        | integer                     |
#  region            | text                        |
#  street_name       | text                        |
#  street_number     | text                        |
#  point_of_interest | text                        |
# Indexes:
#  addresses_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  addresses_airport_id_fkey | (airport_id) REFERENCES airports(id)
# Referenced By:
#  booking_addresses   | booking_addresses_address_id_fkey         | (address_id) REFERENCES addresses(id)
#  company_infos       | company_infos_address_id_fkey             | (address_id) REFERENCES addresses(id)
#  company_infos       | company_infos_legal_address_id_fkey       | (legal_address_id) REFERENCES addresses(id)
#  contacts            | contacts_address_id_fkey                  | (address_id) REFERENCES addresses(id)
#  passenger_addresses | passenger_addresses_address_id_fkey       | (address_id) REFERENCES addresses(id)
#  locations           | locations_address_id_fkey                 | (address_id) REFERENCES addresses(id)
#  pricing_rules       | pricing_rules_destination_address_id_fkey | (destination_address_id) REFERENCES addresses(id)
#  pricing_rules       | pricing_rules_pickup_address_id_fkey      | (pickup_address_id) REFERENCES addresses(id)
