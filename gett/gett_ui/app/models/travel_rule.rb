class TravelRule < Sequel::Model
  plugin :application_model
  plugin :association_pks
  plugin :association_dependencies
  plugin :audited,
    values: [
      :name, :weekdays, :min_distance, :max_distance, :min_time, :max_time,
      :active, :priority, :location, :allow_unregistered, :cheapest
    ],
    many_to_many: [
      { members: { name: :full_name, class: User } },
      :departments,
      :work_roles,
      :vehicles
    ]

  many_to_one :company

  many_to_many :members, join_table: :travel_rules_users,
    left_key: :travel_rule_id, right_key: :user_id
  many_to_many :departments, join_table: :travel_rules_departments
  many_to_many :work_roles
  many_to_many :vehicles

  add_association_dependencies(
    members: :nullify,
    departments: :nullify,
    work_roles: :nullify,
    vehicles: :nullify
  )

  dataset_module do
    subset :active, active: true
  end

  alias allow_unregistered? allow_unregistered
  alias cheapest? cheapest

  def vehicle_pks=(ids)
    super(Vehicle.where(name: Vehicle.where(id: ids).select(:name)).select_map(:id))
  end

  def validate
    super
    validates_presence :name
    validate_any_user_scope
    validate_cheapest
  end

  def weekdays
    return if (value = super).blank?

    (1..7).map{ |i| i.to_s if value & (1 << i - 1) > 0 }.compact
  end

  def weekdays=(value)
    unless value.is_a?(Array)
      super
      return
    end

    super(value.map{ |d| 1 << d.to_i - 1 }.reduce(&:|) || 0)
  end

  private def validate_any_user_scope
    if !allow_unregistered? && member_pks.empty? && department_pks.empty? && work_role_pks.empty?
      errors.add(:users, I18n.t('travel_rule.errors.user_scope_blank'))
    end
  end

  private def validate_cheapest
    if cheapest? && vehicle_pks.length < 2
      errors.add(:cheapest, I18n.t('travel_rule.errors.wrong_price_setting_usage'))
    end
  end
end

# Table: travel_rules
# Columns:
#  id                 | integer                     | PRIMARY KEY DEFAULT nextval('travel_rules_id_seq'::regclass)
#  name               | text                        | NOT NULL
#  company_id         | integer                     | NOT NULL
#  location           | tr_location                 |
#  weekdays           | integer                     | NOT NULL DEFAULT 0
#  priority           | integer                     |
#  min_distance       | double precision            |
#  max_distance       | double precision            |
#  min_time           | time without time zone      | NOT NULL DEFAULT '00:00:00'::time without time zone
#  max_time           | time without time zone      | NOT NULL DEFAULT '23:59:59'::time without time zone
#  active             | boolean                     | NOT NULL DEFAULT true
#  created_at         | timestamp without time zone | NOT NULL
#  updated_at         | timestamp without time zone | NOT NULL
#  allow_unregistered | boolean                     | NOT NULL DEFAULT false
#  cheapest           | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  travel_rules_pkey | PRIMARY KEY btree (id)
# Foreign key constraints:
#  travel_rules_company_id_fkey | (company_id) REFERENCES companies(id)
# Referenced By:
#  travel_rules_departments | travel_rules_departments_travel_rule_id_fkey | (travel_rule_id) REFERENCES travel_rules(id)
#  travel_rules_users       | travel_rules_users_travel_rule_id_fkey       | (travel_rule_id) REFERENCES travel_rules(id)
#  travel_rules_vehicles    | travel_rules_vehicles_travel_rule_id_fkey    | (travel_rule_id) REFERENCES travel_rules(id)
#  travel_rules_work_roles  | travel_rules_work_roles_travel_rule_id_fkey  | (travel_rule_id) REFERENCES travel_rules(id)
