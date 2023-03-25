class Contact < Sequel::Model
  plugin :application_model
  plugin :audited,
    values: [:first_name, :last_name, :phone, :mobile, :fax, :email]

  many_to_one :company
  many_to_one :address
  one_to_many :company_infos

  alias primary? primary

  def validate
    super
    validates_presence :company_id
  end

  def full_name
    [first_name, last_name].compact.join(' ')
  end

  def used?
    persisted? && company_infos_dataset.any?
  end
end

# Table: contacts
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('contacts_id_seq'::regclass)
#  company_id | integer                     | NOT NULL
#  primary    | boolean                     | NOT NULL DEFAULT true
#  phone      | text                        |
#  mobile     | text                        |
#  fax        | text                        |
#  email      | text                        |
#  first_name | text                        |
#  last_name  | text                        |
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
#  address_id | integer                     |
#  active     | boolean                     | NOT NULL DEFAULT true
# Indexes:
#  contacts_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  contacts_address_id_fkey | (address_id) REFERENCES addresses(id)
#  contacts_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  company_infos | company_infos_contact_id_fkey | (contact_id) REFERENCES contacts(id)
