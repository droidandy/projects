class WorkRole < Sequel::Model
  plugin :application_model
  plugin :association_dependencies

  one_to_many :members
  many_to_one :company
  many_to_many :travel_rules

  add_association_dependencies(
    travel_rules: :nullify
  )

  # cannot gracefully handle :members association dependency due to CTI
  def before_destroy
    super
    DB[:members].where(work_role_id: id).update(work_role_id: nil)
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

# Table: work_roles
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('work_roles_id_seq'::regclass)
#  company_id | integer                     | NOT NULL
#  name       | text                        | NOT NULL
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  work_roles_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  work_roles_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  members                 | members_work_role_id_fkey                 | (work_role_id) REFERENCES work_roles(id)
#  travel_rules_work_roles | travel_rules_work_roles_work_role_id_fkey | (work_role_id) REFERENCES work_roles(id)
