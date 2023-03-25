class ReferenceEntry < Sequel::Model
  plugin :application_model, timestamps: false

  many_to_one :booking_reference

  def validate
    super
    validates_presence [:value, :booking_reference]
  end
end

# Table: reference_entries
# Columns:
#  id                   | integer | PRIMARY KEY DEFAULT nextval('reference_entries_id_seq'::regclass)
#  booking_reference_id | integer | NOT NULL
#  value                | text    | NOT NULL
# Indexes:
#  reference_entries_pkey        | PRIMARY KEY btree (id)
#  reference_entries_value_index | btree (value)
# Foreign key constraints:
#  reference_entries_booking_reference_id_fkey | (booking_reference_id) REFERENCES booking_references(id)
