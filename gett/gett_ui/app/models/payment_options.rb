class PaymentOptions < Sequel::Model
  SPLIT_INVOICES = %w(user department reference).freeze

  module InvoicingSchedule
    WEEKLY  = 'weekly'.freeze
    MONTHLY = 'monthly'.freeze

    ALL = [WEEKLY, MONTHLY].freeze
  end

  module PaymentType
    ACCOUNT = 'account'.freeze
    CASH = 'cash'.freeze
    PASSENGER_PAYMENT_CARD = 'passenger_payment_card'.freeze
    PASSENGER_PAYMENT_CARD_PERIODIC = 'passenger_payment_card_periodic'.freeze
    COMPANY_PAYMENT_CARD = 'company_payment_card'.freeze
    PERSONAL_PAYMENT_CARD = 'personal_payment_card'.freeze
    BUSINESS_PAYMENT_CARD = 'business_payment_card'.freeze

    INVOICE_TYPES = [
      ACCOUNT,
      COMPANY_PAYMENT_CARD
    ].freeze

    PASSENGER_PAYMENT_CARD_TYPES = [
      PASSENGER_PAYMENT_CARD,
      PASSENGER_PAYMENT_CARD_PERIODIC
    ].freeze
  end

  PAYMENT_TERMS_DAYS = [0, 7, 14, 30, 60, 90].freeze

  plugin :application_model
  plugin :instance_hooks
  plugin :dirty
  plugin :boolean_readers

  plugin :audited,
    values: [
      :split_invoice, :business_credit, :payment_terms, :payment_types,
      :additional_billing_recipients, :invoicing_schedule, :business_credit_expended
    ]

  many_to_one :company

  def before_update
    reset_column(:business_credit) if column_changed?(:business_credit) && business_credit_expended?
    super
  end

  def validate
    super

    validates_presence([:company_id, :payment_types, :default_payment_type])
    validates_presence([:payment_terms, :invoicing_schedule]) if payment_types.include?('account')
    validates_includes(InvoicingSchedule::ALL, :invoicing_schedule, allow_nil: true)
    validates_includes(SPLIT_INVOICES, :split_invoice, allow_nil: true)
    validates_comma_separated_emails(:additional_billing_recipients)
    validates_integer(:payment_terms, allow_nil: true)
    validates_operator(:>=, 0, :business_credit, allow_nil: true)
    validates_includes(PAYMENT_TERMS_DAYS, :payment_terms, allow_nil: true)

    if payment_types&.uniq != payment_types
      errors.add(:payment_types, I18n.t('payment_options.errors.should_be_uniq'))
    end

    if (PaymentType::INVOICE_TYPES & payment_types).many? ||
      payment_types.include?(PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC) && payment_types.length > 1

      errors.add(:payment_types, I18n.t('payment_options.errors.conflicting_payment_types'))
    end

    return if new?

    if associated_payment_types_removed?
      errors.add(:payment_types, I18n.t('payment_options.errors.cannot_change_payment_type'))
    end
  end

  def payment_types
    super || []
  end

  def invoice_payment_type
    PaymentType::INVOICE_TYPES.find { |payment_type| payment_types.include?(payment_type) }
  end

  def additional_billing_recipient_emails
    Array(additional_billing_recipients&.split(',')).map(&:strip)
  end

  def with_periodic_payment_type?
    payment_types.include?(PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC)
  end

  private def associated_payment_types_removed?
    return false unless column_changed?(:payment_types)

    company.bookings_dataset.where(payment_method: removed_payment_types).any?
  end

  private def removed_payment_types
    (Array(initial_value(:payment_types)) - payment_types).tap do |types|
      types.concat(Booking::CREDIT_PAYMENTS) if types.include?('passenger_payment_card')
    end
  end
end

# Table: payment_options
# Columns:
#  id                            | integer                     | PRIMARY KEY DEFAULT nextval('payment_options_id_seq'::regclass)
#  company_id                    | integer                     | NOT NULL
#  business_credit               | double precision            |
#  created_at                    | timestamp without time zone | NOT NULL
#  updated_at                    | timestamp without time zone | NOT NULL
#  payment_terms                 | integer                     | NOT NULL
#  invoicing_schedule            | invoicing_schedule          | NOT NULL
#  split_invoice                 | text                        |
#  additional_billing_recipients | text                        |
#  payment_types                 | payment_type[]              | DEFAULT ARRAY[]::payment_type[]
#  default_payment_type          | payment_type                | NOT NULL
#  business_credit_expended      | boolean                     | DEFAULT false
# Indexes:
#  payment_options_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  payment_options_company_id_fkey | (company_id) REFERENCES companies(id)
