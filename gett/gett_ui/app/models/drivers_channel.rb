class DriversChannel < Sequel::Model
  plugin :application_model
  plugin :points, columns: :location

  SIMILAR_DISTANCE_DIFF = 0.001 # ~115 meters

  def self.in_close_vicinity_to(loc_cords)
    first(Sequel.lit("(location <-> ?) <= ?", "(#{loc_cords[:lat]}, #{loc_cords[:lng]})", SIMILAR_DISTANCE_DIFF))
  end

  dataset_module do
    scope(:expired) { where{ valid_until < DateTime.current } }

    def with_location(loc)
      first(Sequel.lit("location ~= ?", "(#{loc[0]}, #{loc[1]})"))
    end
  end

  def lat
    location[0]
  end

  def lng
    location[1]
  end
end

# Table: drivers_channels
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('drivers_channels_id_seq'::regclass)
#  channel      | text                        | NOT NULL
#  location     | point                       | NOT NULL
#  valid_until  | timestamp without time zone | NOT NULL
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
#  country_code | text                        |
# Indexes:
#  drivers_channels_pkey | PRIMARY KEY btree (id)
