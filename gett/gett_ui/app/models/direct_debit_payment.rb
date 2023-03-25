class DirectDebitPayment < Sequel::Model
  plugin :application_model

  STATUSES = %w(pending successful failed).freeze

  STATUSES.each do |value|
    const_set(value.upcase, value)

    define_method("#{value}?") do
      status == value
    end
  end

  many_to_one :invoice
  many_to_one :direct_debit_mandate

  dataset_module do
    subset :pending, status: PENDING
  end

  def validate
    super
    validates_presence([
      :invoice, :direct_debit_mandate,
      :go_cardless_payment_id, :amount_cents, :currency,
      :status
    ])
  end
end

# Table: direct_debit_payments
# Columns:
#  id                      | integer                     | PRIMARY KEY DEFAULT nextval('direct_debit_payments_id_seq'::regclass)
#  invoice_id              | integer                     | NOT NULL
#  direct_debit_mandate_id | integer                     | NOT NULL
#  go_cardless_payment_id  | text                        | NOT NULL
#  amount_cents            | integer                     | NOT NULL
#  currency                | text                        | NOT NULL DEFAULT 'GBP'::text
#  status                  | direct_debit_payment_status | NOT NULL
#  created_at              | timestamp without time zone | NOT NULL
#  updated_at              | timestamp without time zone | NOT NULL
# Indexes:
#  direct_debit_payments_pkey                          | PRIMARY KEY btree (id)
#  direct_debit_payments_direct_debit_mandate_id_index | btree (direct_debit_mandate_id)
#  direct_debit_payments_invoice_id_index              | btree (invoice_id)
# Foreign key constraints:
#  direct_debit_payments_direct_debit_mandate_id_fkey | (direct_debit_mandate_id) REFERENCES direct_debit_mandates(id)
#  direct_debit_payments_invoice_id_fkey              | (invoice_id) REFERENCES invoices(id)
