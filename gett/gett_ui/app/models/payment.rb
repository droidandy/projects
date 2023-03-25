using Sequel::CoreRefinements

class Payment < Sequel::Model
  STATUSES = %i(initialized pending authorized captured refunded voided failed credited).freeze

  plugin :application_model
  plugin :association_pks
  plugin :config

  config do |c|
    c.success_statuses = %w(captured).freeze
    c.pending_statuses = %w(pending authorized).freeze
  end

  many_to_one :booking
  many_to_many :invoices, delay_pks: :always

  dataset_module do
    subset :pending, status: Payment.config.pending_statuses
    subset :failed, ~{status: ['pending', 'captured', 'authorized']}
  end

  delegate *STATUSES.map{ |s| "#{s}?" }, to: :status, allow_nil: true

  def before_save
    super
    self.fingerprint = self.class.generate_fingerprint(values.merge(invoice_pks: invoice_pks))
  end

  def validate
    super
    validates_presence [:amount_cents, :currency, :status]
    validates_presence :booking_id if invoice_pks.blank?
    validates_presence :invoice_pks if booking_id.blank?
  end

  def status
    super&.inquiry
  end

  def successful?
    status.in?(config.success_statuses)
  end

  def self.generate_fingerprint(amount_cents:, booking_id: nil, invoice_pks: nil, **)
    invoices_value = invoice_pks&.sort&.join(':')
    value = [amount_cents, booking_id, invoices_value].join(':')
    Digest::MD5.hexdigest(value)
  end
end

# Table: payments
# Columns:
#  id                | integer                     | PRIMARY KEY DEFAULT nextval('payments_id_seq'::regclass)
#  booking_id        | integer                     |
#  status            | payments_status             | NOT NULL DEFAULT 'initialized'::payments_status
#  amount_cents      | integer                     | NOT NULL
#  currency          | currency                    | NOT NULL DEFAULT 'GBP'::currency
#  description       | text                        |
#  payments_os_id    | text                        |
#  error_description | text                        |
#  created_at        | timestamp without time zone | NOT NULL
#  updated_at        | timestamp without time zone | NOT NULL
#  zooz_request_id   | text                        |
#  fingerprint       | text                        | NOT NULL DEFAULT ''::text
#  retries           | integer                     | NOT NULL DEFAULT 0
# Indexes:
#  payments_pkey           | PRIMARY KEY btree (id)
#  payments_booking_id_key | UNIQUE btree (booking_id)
# Foreign key constraints:
#  payments_booking_id_fkey | (booking_id) REFERENCES bookings(id)
