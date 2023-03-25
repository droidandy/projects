class Vehicle < Sequel::Model
  # following should be read as :key is a fallback for :value
  # TODO: implement a more generic way to setup fallback as a part of
  # Vehicle model refactoring
  FALLBACKS = {
    'OTBlackTaxi'   => 'BlackTaxi',
    'OTBlackTaxiXL' => 'BlackTaxiXL'
  }.freeze

  plugin :application_model
  plugin :association_pks

  one_to_many :bookings
  many_to_many :travel_rules
  many_to_many :vehicle_vendors

  delegate *Bookings::API_TYPES.keys.map{ |st| "#{st}?" }, to: :service_type, allow_nil: true
  delegate *Bookings::Vehicle::VEHICLE_NAMES.map{ |st| "#{st.snakecase}?" }, to: :vehicle_type, allow_nil: true

  dataset_module do
    Bookings::API_TYPES.each_key do |st|
      subset st, service_type: st.to_s
    end

    subset :active, active: true
    subset :fallback, name: FALLBACKS.keys

    def by_type(type)
      where(service_type: type.to_s)
    end
  end

  def validate
    super
    validates_presence [:name, :value, :service_type]
  end

  def fallback?
    FALLBACKS.key?(name)
  end

  def service_type
    super&.inquiry
  end

  def vehicle_type
    name&.snakecase&.inquiry
  end

  def allow_quote?
    ot? || get_e? || carey? || splyt?
  end
end

# Table: vehicles
# Columns:
#  id                    | integer          | PRIMARY KEY DEFAULT nextval('vehicles_id_seq'::regclass)
#  name                  | text             | NOT NULL
#  value                 | text             | NOT NULL
#  service_type          | service_provider | NOT NULL
#  pre_eta               | integer          | NOT NULL DEFAULT 0
#  earliest_available_in | integer          | NOT NULL DEFAULT 0
#  active                | boolean          | NOT NULL DEFAULT true
# Indexes:
#  vehicles_pkey | PRIMARY KEY btree (id)
# Referenced By:
#  bookings                 | bookings_vehicle_id_fkey                 | (vehicle_id) REFERENCES vehicles(id)
#  travel_rules_vehicles    | travel_rules_vehicles_vehicle_id_fkey    | (vehicle_id) REFERENCES vehicles(id)
#  vehicle_vendors_vehicles | vehicle_vendors_vehicles_vehicle_id_fkey | (vehicle_id) REFERENCES vehicles(id)
