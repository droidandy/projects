class SpecialRequirement < Sequel::Model
  plugin :application_model

  many_to_many :companies

  def validate
    super
    validates_presence([:key, :label, :service_type])
    validates_includes(Bookings::Providers::ALL.map(&:to_s), :service_type)
  end
end

# Table: special_requirements
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('special_requirements_id_seq'::regclass)
#  service_type | text                        | NOT NULL
#  key          | text                        | NOT NULL
#  label        | text                        | NOT NULL
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
# Indexes:
#  special_requirements_pkey                   | PRIMARY KEY btree (id)
#  special_requirements_service_type_key_index | btree (service_type, key)
# Referenced By:
#  companies_special_requirements | companies_special_requirements_special_requirement_id_fkey | (special_requirement_id) REFERENCES special_requirements(id)
