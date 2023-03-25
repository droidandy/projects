using Sequel::CoreRefinements

class Invoice < Sequel::Model
  module Type
    INVOICE = 'invoice'.freeze
    CC_INVOICE = 'cc_invoice'.freeze
    CREDIT_NOTE = 'credit_note'.freeze

    INVOICES = [
      INVOICE,
      CC_INVOICE
    ].freeze
  end

  module Status
    PAID = :paid
    PARTIALLY_PAID = :partially_paid
    OVERDUE = :overdue
    OUTSTANDING = :outstanding
    PROCESSING = :processing
    UNDER_REVIEW = :under_review
    ISSUED = :issued
    APPLIED = :applied

    REVIEWABLE_STATUSES = [
      OUTSTANDING,
      OVERDUE,
      PARTIALLY_PAID
    ].freeze
  end

  ALLOWED_OVERDUE_PERIOD = 25.days.freeze

  plugin :application_model
  plugin :association_pks
  plugin :association_dependencies
  plugin :boolean_readers

  many_to_one :company
  many_to_one :member # only for CC_INVOICE
  many_to_many :bookings, delay_pks: :always
  many_to_many :payments, delay_pks: :always
  many_to_one :paid_by, class: 'User'
  many_to_one :created_by, class: 'User'
  one_to_many :credit_notes, key: :credited_invoice_id, class: 'Invoice', conditions: {type: Type::CREDIT_NOTE}
  many_to_one :credited_invoice, class: 'Invoice'
  one_to_many :direct_debit_payments

  one_to_many :credit_note_lines, key: :credit_note_id

  add_association_dependencies(
    credit_note_lines: :delete
  )

  dataset_module do
    pending_payment_invoices =
      Payment.pending.join(:invoices_payments, payment_id: :payments[:id]).select(:invoice_id)
    pending_direct_debit_invoices = DirectDebitPayment.pending.select(:invoice_id)
    is_processing = proc { |r| (r.id =~ pending_payment_invoices) | (r.id =~ pending_direct_debit_invoices) }

    scope(:billing)          { where(type: Type::INVOICES) }
    scope(:credit_notes)     { where(type: Type::CREDIT_NOTE) }
    scope(:cc_invoices)      { where(type: Type::CC_INVOICE) }

    scope(:not_paid)         { billing.where(paid_at: nil, paid_amount_cents: 0) }
    scope(:paid)             { billing.where(paid_amount_cents: :amount_cents) }
    scope(:not_fully_paid)   { billing.where{ paid_amount_cents !~ amount_cents } }
    scope(:partially_paid)   { billing.where{ |r| (r.paid_amount_cents > 0) & (r.paid_amount_cents < r.amount_cents) } }
    scope(:outstanding)      { not_paid.not_under_review.where{ |r| r.overdue_at > Time.current } }
    scope(:overdue)          { not_paid.not_under_review.where{ |r| r.overdue_at <= Time.current } }
    scope(:expired)          { not_paid.not_under_review.where{ |r| r.overdue_at <= Time.current - ALLOWED_OVERDUE_PERIOD } }
    scope(:processing)       { not_paid.where(&is_processing) }
    scope(:payable)          { billing.where{ |r| r.paid_amount_cents < r.amount_cents } }
    scope(:issued)           { credit_notes.where{ (credited_invoice_id =~ nil) & (applied_manually =~ false) } }
    scope(:applied)          { credit_notes.where{ (credited_invoice_id !~ nil) | (applied_manually =~ true) } }
    scope(:under_review)     { where(under_review: true) }
    scope(:not_under_review) { where(under_review: false) }

    # Used in Admin::Invoices::Index, both scopes exclude processing invoices.
    scope(:outstanding_without_processing) { outstanding.exclude(&is_processing) }
    scope(:overdue_without_processing) { overdue.exclude(&is_processing) }
  end

  delegate :name, :payment_types, to: :company, prefix: true
  delegate :full_name, to: :member, prefix: true, allow_nil: true

  def validate
    super
    validates_presence :member_id if cc_invoice?
    if !credit_note? && !paid_amount_cents.in?(0..amount_cents)
      errors.add(:paid_amount_cents, 'paid amount is invalid')
    end
  end

  def paid?
    paid_at.present? && paid_amount_cents == amount_cents
  end

  def partially_paid?
    paid_amount_cents.present? &&
      paid_amount_cents > 0 && paid_amount_cents < amount_cents
  end

  def paid_by_business_credit?
    business_credit_cents.present? && amount_cents.zero?
  end

  def outstanding?
    !partially_paid? && !paid? && overdue_at&.future?
  end

  def overdue?
    return false if credit_note?

    !paid? && overdue_at.past?
  end

  def reviewable?
    status.in?(Status::REVIEWABLE_STATUSES)
  end

  def payment_pending?
    !paid? && (
      payments_dataset.pending.any? ||
      direct_debit_payments_dataset.pending.any?
    )
  end

  def invoice?
    type == Type::INVOICE
  end

  def cc_invoice?
    type == Type::CC_INVOICE
  end

  def credit_note?
    type == Type::CREDIT_NOTE
  end

  def last_payment
    (payments + direct_debit_payments).max_by(&:created_at)
  end

  def mark_as_paid!(new_paid_amount_cents = amount_cents, new_paid_by = nil)
    update(paid_at: Time.current, paid_amount_cents: new_paid_amount_cents, paid_by: new_paid_by)
  end

  def status
    return credit_note_status     if credit_note?
    return Status::PAID           if paid?
    return Status::UNDER_REVIEW   if under_review?
    return Status::PARTIALLY_PAID if partially_paid?
    return Status::PROCESSING     if payment_pending?
    return Status::OVERDUE        if overdue?

    Status::OUTSTANDING
  end

  private def credit_note_status
    (credited_invoice_id.present? || applied_manually) ? Status::APPLIED : Status::ISSUED
  end
end

# Table: invoices
# Columns:
#  id                    | integer                     | PRIMARY KEY DEFAULT nextval('invoices_id_seq'::regclass)
#  company_id            | integer                     | NOT NULL
#  invoicing_schedule    | invoicing_schedule          | NOT NULL
#  payment_terms         | integer                     | NOT NULL
#  billing_period_start  | timestamp without time zone | NOT NULL
#  billing_period_end    | timestamp without time zone | NOT NULL
#  overdue_at            | timestamp without time zone | NOT NULL
#  amount_cents          | integer                     | NOT NULL
#  paid_at               | timestamp without time zone |
#  created_at            | timestamp without time zone | NOT NULL
#  updated_at            | timestamp without time zone | NOT NULL
#  paid_by_id            | integer                     |
#  business_credit_cents | integer                     |
#  type                  | invoice_type                | NOT NULL DEFAULT 'invoice'::invoice_type
#  credited_invoice_id   | integer                     |
#  created_by_id         | integer                     |
#  paid_amount_cents     | integer                     |
#  member_id             | integer                     |
#  applied_manually      | boolean                     | NOT NULL DEFAULT false
#  under_review          | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  invoices_pkey             | PRIMARY KEY btree (id)
#  invoices_company_id_index | btree (company_id)
# Foreign key constraints:
#  invoices_created_by_id_fkey       | (created_by_id) REFERENCES users(id)
#  invoices_credited_invoice_id_fkey | (credited_invoice_id) REFERENCES invoices(id)
#  invoices_member_id_fkey           | (member_id) REFERENCES users(id)
#  invoices_paid_by_id_fkey          | (paid_by_id) REFERENCES users(id)
# Referenced By:
#  invoices              | invoices_credited_invoice_id_fkey     | (credited_invoice_id) REFERENCES invoices(id)
#  credit_note_lines     | credit_note_lines_credit_note_id_fkey | (credit_note_id) REFERENCES invoices(id)
#  direct_debit_payments | direct_debit_payments_invoice_id_fkey | (invoice_id) REFERENCES invoices(id)
