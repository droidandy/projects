class ApiKey < Sequel::Model
  plugin :application_model

  many_to_one :user

  def before_validation
    super
    generate_key
  end

  def validate
    super
    validates_presence [:user_id, :key]
  end

  private def generate_key
    return if key.present?

    self.key = SecureRandom.hex
  end
end

# Table: api_keys
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('api_keys_id_seq'::regclass)
#  user_id    | integer                     | NOT NULL
#  key        | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  api_keys_pkey      | PRIMARY KEY btree (id)
#  api_keys_key_index | UNIQUE btree (key)
# Foreign key constraints:
#  api_keys_user_id_fkey | (user_id) REFERENCES users(id)
