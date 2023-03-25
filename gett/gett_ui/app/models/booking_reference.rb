class BookingReference < Sequel::Model
  plugin :application_model
  plugin :association_dependencies
  plugin :dirty

  many_to_one :company
  one_to_many :reference_entries
  one_to_many :booker_references

  add_association_dependencies(
    reference_entries: :delete,
    booker_references: :delete
  )

  dataset_module do
    subset :active, active: true
    subset :sftp, sftp_server: true
  end

  mount_uploader :attachment, CsvUploader

  alias validation_required? validation_required
  alias mandatory? mandatory
  alias sftp_server? sftp_server

  def validate
    super
    validates_presence :company
    validates_presence :name if active
  end

  def active?
    active && company.enterprise?
  end

  def sftp_csv_path
    "reference_#{priority + 1}.csv"
  end
end

# Table: booking_references
# Columns:
#  id                  | integer                     | PRIMARY KEY DEFAULT nextval('booking_references_id_seq'::regclass)
#  company_id          | integer                     | NOT NULL
#  name                | text                        |
#  active              | boolean                     | DEFAULT true
#  created_at          | timestamp without time zone | NOT NULL
#  updated_at          | timestamp without time zone | NOT NULL
#  mandatory           | boolean                     | NOT NULL DEFAULT false
#  validation_required | boolean                     | NOT NULL DEFAULT false
#  priority            | integer                     | NOT NULL
#  dropdown            | boolean                     | NOT NULL DEFAULT false
#  sftp_server         | boolean                     | NOT NULL DEFAULT false
#  cost_centre         | boolean                     | NOT NULL DEFAULT false
#  conditional         | boolean                     | NOT NULL DEFAULT false
#  attachment          | text                        |
# Indexes:
#  booking_references_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  booking_references_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  reference_entries | reference_entries_booking_reference_id_fkey | (booking_reference_id) REFERENCES booking_references(id)
