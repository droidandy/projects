class DirectDebitMandate < Sequel::Model
  plugin :application_model
  plugin :association_dependencies

  STATUSES = %w(initiated pending active failed cancelled).freeze

  STATUSES.each do |value|
    const_set(value.upcase, value)

    define_method("#{value}?") do
      status == value
    end
  end

  many_to_one :company
  many_to_one :created_by, class: 'User'
  one_to_many :direct_debit_payments

  add_association_dependencies(
    direct_debit_payments: :delete
  )

  def validate
    super
    validates_presence [:company, :created_by, :go_cardless_redirect_flow_id, :status]
    validates_presence :go_cardless_mandate_id if active?
  end
end

# Table: direct_debit_mandates
# Columns:
#  id                           | integer                     | PRIMARY KEY DEFAULT nextval('direct_debit_mandates_id_seq'::regclass)
#  company_id                   | integer                     | NOT NULL
#  created_by_id                | integer                     | NOT NULL
#  go_cardless_redirect_flow_id | text                        | NOT NULL
#  go_cardless_mandate_id       | text                        |
#  status                       | direct_debit_mandate_status | NOT NULL
#  created_at                   | timestamp without time zone | NOT NULL
#  updated_at                   | timestamp without time zone | NOT NULL
# Indexes:
#  direct_debit_mandates_pkey                | PRIMARY KEY btree (id)
#  direct_debit_mandates_company_id_index    | btree (company_id)
#  direct_debit_mandates_created_by_id_index | btree (created_by_id)
# Foreign key constraints:
#  direct_debit_mandates_company_id_fkey    | (company_id) REFERENCES companies(id)
#  direct_debit_mandates_created_by_id_fkey | (created_by_id) REFERENCES users(id)
# Referenced By:
#  direct_debit_payments | direct_debit_payments_direct_debit_mandate_id_fkey | (direct_debit_mandate_id) REFERENCES direct_debit_mandates(id)
