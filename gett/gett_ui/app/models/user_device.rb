class UserDevice < Sequel::Model
  plugin :application_model

  many_to_one :user

  dataset_module do
    subset :active, active: true
  end

  alias active? active

  def validate
    super
    validates_unique(:uuid)
  end
end

# Table: user_devices
# Columns:
#  id                      | integer                     | PRIMARY KEY DEFAULT nextval('user_devices_id_seq'::regclass)
#  user_id                 | integer                     | NOT NULL
#  token                   | text                        | NOT NULL
#  created_at              | timestamp without time zone | NOT NULL
#  updated_at              | timestamp without time zone | NOT NULL
#  uuid                    | text                        |
#  device_type             | text                        |
#  api_version             | text                        | DEFAULT 'v1'::text
#  os_type                 | text                        |
#  client_os_version       | text                        |
#  device_network_provider | text                        |
#  last_logged_in_at       | timestamp without time zone |
#  active                  | boolean                     | NOT NULL DEFAULT true
# Indexes:
#  user_devices_pkey          | PRIMARY KEY btree (id)
#  user_devices_token_index   | btree (token)
#  user_devices_user_id_index | btree (user_id)
# Foreign key constraints:
#  user_devices_user_id_fkey | (user_id) REFERENCES users(id)
