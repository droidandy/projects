class Location < Sequel::Model
  plugin :application_model

  dataset_module do
    subset :default, default: true
  end

  many_to_one :company
  many_to_one :address

  alias default? default

  def validate
    super
    validates_presence [:address_id, :company_id, :name]
    validates_unique(:name) { |ds| ds.where(company_id: company_id) }
    validates_unique(:default) { |ds| ds.where(company_id: company_id) } if default?
    validates_unique(:address) { |ds| ds.where(company_id: company_id) }
  end
end

# Table: locations
# Columns:
#  id                  | integer                     | PRIMARY KEY DEFAULT nextval('locations_id_seq'::regclass)
#  company_id          | integer                     | NOT NULL
#  address_id          | integer                     | NOT NULL
#  name                | text                        | NOT NULL
#  pickup_message      | text                        |
#  destination_message | text                        |
#  default             | boolean                     | DEFAULT false
#  created_at          | timestamp without time zone | NOT NULL
#  updated_at          | timestamp without time zone | NOT NULL
# Indexes:
#  locations_pkey                        | PRIMARY KEY btree (id)
#  locations_company_id_address_id_index | UNIQUE btree (company_id, address_id)
#  locations_company_id_default_index    | UNIQUE btree (company_id, "default") WHERE "default" IS TRUE
#  locations_company_id_name_index       | UNIQUE btree (company_id, name)
# Foreign key constraints:
#  locations_address_id_fkey | (address_id) REFERENCES addresses(id)
#  locations_company_id_fkey | (company_id) REFERENCES companies(id)
