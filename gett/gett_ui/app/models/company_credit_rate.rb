class CompanyCreditRate < Sequel::Model
  plugin :application_model
  plugin :boolean_readers

  many_to_one :company

  def validate
    super
    validates_presence :company
  end

  def inactivate!
    update(active: false)
  end
end

# Table: company_credit_rates
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('company_credit_rates_id_seq'::regclass)
#  company_id | integer                     | NOT NULL
#  value      | integer                     |
#  active     | boolean                     | NOT NULL DEFAULT true
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  company_credit_rates_pkey             | PRIMARY KEY btree (id)
#  company_credit_rates_company_id_index | btree (company_id)
# Foreign key constraints:
#  company_credit_rates_company_id_fkey | (company_id) REFERENCES companies(id)
