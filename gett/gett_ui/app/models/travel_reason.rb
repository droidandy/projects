class TravelReason < Sequel::Model
  plugin :application_model
  plugin :association_dependencies

  many_to_one :company
  one_to_many :bookings

  add_association_dependencies(
    bookings: :nullify
  )

  dataset_module do
    subset :active, active: true
  end

  alias active? active

  def validate
    super
    validates_presence :name
    validates_unique(:name){ |ds| ds.where(company_id: company_id) }
  end
end

# Table: travel_reasons
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('travel_reasons_id_seq'::regclass)
#  company_id | integer                     | NOT NULL
#  name       | text                        | NOT NULL
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
#  active     | boolean                     | NOT NULL DEFAULT true
# Indexes:
#  travel_reasons_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  travel_reasons_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  bookings | bookings_travel_reason_id_fkey | (travel_reason_id) REFERENCES travel_reasons(id)
