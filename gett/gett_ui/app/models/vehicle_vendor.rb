class VehicleVendor < Sequel::Model
  plugin :application_model

  one_to_many :bookings
  many_to_many :vehicles

  dataset_module do
    scope(:specialized) { where(specialized: true) }
  end

  def validate
    super
    validates_presence(%i[key name])
  end
end

# Table: vehicle_vendors
# Columns:
#  id                | integer                     | PRIMARY KEY DEFAULT nextval('vehicle_vendors_id_seq'::regclass)
#  key               | text                        | NOT NULL
#  name              | text                        | NOT NULL
#  city              | text                        |
#  specialized       | boolean                     | NOT NULL DEFAULT false
#  created_at        | timestamp without time zone | NOT NULL
#  updated_at        | timestamp without time zone | NOT NULL
#  phone             | text                        |
#  postcode_prefixes | text[]                      | NOT NULL DEFAULT ARRAY[]::text[]
# Indexes:
#  vehicle_vendors_pkey       | PRIMARY KEY btree (id)
#  vehicle_vendors_city_index | btree (city)
#  vehicle_vendors_key_index  | btree (key)
# Referenced By:
#  bookings                 | bookings_vehicle_vendor_id_fkey                 | (vehicle_vendor_id) REFERENCES vehicle_vendors(id)
#  vehicle_vendors_vehicles | vehicle_vendors_vehicles_vehicle_vendor_id_fkey | (vehicle_vendor_id) REFERENCES vehicle_vendors(id)
