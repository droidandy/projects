class CreditNoteLine < Sequel::Model
  plugin :application_model

  many_to_one :credit_note, class: 'Invoice'
  many_to_one :booking

  def validate
    super
    validates_presence [:credit_note_id, :booking_id]
  end

  def total_amount_cents
    amount_cents + vat
  end

  def vatable?
    vat > 0
  end
end

# Table: credit_note_lines
# Columns:
#  id             | integer | PRIMARY KEY DEFAULT nextval('credit_note_lines_id_seq'::regclass)
#  credit_note_id | integer | NOT NULL
#  booking_id     | integer | NOT NULL
#  amount_cents   | integer | NOT NULL
#  vat            | integer | NOT NULL DEFAULT 0
# Indexes:
#  credit_note_lines_pkey                            | PRIMARY KEY btree (id)
#  credit_note_lines_credit_note_id_booking_id_index | UNIQUE btree (credit_note_id, booking_id)
# Foreign key constraints:
#  credit_note_lines_booking_id_fkey     | (booking_id) REFERENCES bookings(id)
#  credit_note_lines_credit_note_id_fkey | (credit_note_id) REFERENCES invoices(id)
