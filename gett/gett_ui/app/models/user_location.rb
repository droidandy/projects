class UserLocation < Sequel::Model
  plugin :application_model

  many_to_one :user

  def validate
    super
    validates_presence [:user, :lat, :lng]
  end
end

# Table: user_location
# Columns:
#  id                      | integer                     | PRIMARY KEY DEFAULT nextval('user_devices_id_seq'::regclass)
#  user_id                 | integer                     | NOT NULL
#  lat                     | double precision            | NOT NULL
#  lng                     | double precision            | NOT NULL
#  created_at              | timestamp without time zone | NOT NULL
#  updated_at              | timestamp without time zone | NOT NULL
# Indexes:
#  user_locations_pkey          | PRIMARY KEY btree (id)
#  user_locations_user_id_index | btree (user_id)
# Foreign key constraints:
#  user_locations_user_id_fkey | (user_id) REFERENCES users(id)
