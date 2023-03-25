class Department < Sequel::Model
  plugin :application_model
  plugin :association_dependencies

  one_to_many :members
  many_to_one :company
  many_to_many :travel_rules, join_table: :travel_rules_departments

  add_association_dependencies(
    travel_rules: :nullify
  )

  # cannot gracefully handle :members association dependency due to CTI
  def before_destroy
    super
    DB[:members].where(department_id: id).update(department_id: nil)
  end

  def validate
    super
    validates_presence :name
    validates_unique(:name){ |ds| ds.where(company_id: company_id) }
  end

  def member_pks
    members.map(&:id)
  end
end

# Table: departments
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('departments_id_seq'::regclass)
#  company_id | integer                     | NOT NULL
#  name       | text                        | NOT NULL
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  departments_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  departments_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  members                  | members_department_id_fkey                  | (department_id) REFERENCES departments(id)
#  travel_rules_departments | travel_rules_departments_department_id_fkey | (department_id) REFERENCES departments(id)
