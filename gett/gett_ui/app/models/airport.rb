class Airport < Sequel::Model
  plugin :application_model

  # NOTE: actually returns any first record in database, located in area with
  # hardcoded bounds for passed `lat`, `lng`.
  def self.closest(lat, lng)
    ratio = 0.03 # ~3km on google coordinates

    lat_bounds = (lat - ratio)..(lat + ratio)
    lng_bounds = (lng - ratio)..(lng + ratio)

    find(lat: lat_bounds, lng: lng_bounds)
  end
end

# Table: airports
# Columns:
#  id   | integer          | PRIMARY KEY DEFAULT nextval('airports_id_seq'::regclass)
#  name | text             |
#  iata | text             |
#  lat  | double precision |
#  lng  | double precision |
# Indexes:
#  airports_pkey      | PRIMARY KEY btree (id)
#  airports_lat_index | btree (lat)
#  airports_lng_index | btree (lng)
# Referenced By:
#  addresses            | addresses_airport_id_fkey            | (airport_id) REFERENCES airports(id)
#  predefined_addresses | predefined_addresses_airport_id_fkey | (airport_id) REFERENCES airports(id)
