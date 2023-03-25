Sequel.migration do
  change do
    create_enum :tr_price_setting, %w(fastest cheapest)
    create_enum :tr_location, %w(
      GreaterLondon CentralLondon
      Birmingham Leeds Glasgow Manchester Edinburgh Liverpool
    )

    create_table :travel_rules do
      primary_key :id

      String :name, null: false

      foreign_key :company_id, :companies, null: false
      tr_price_setting :price_setting
      tr_location :location
      Integer :weekdays, null: false, default: 0
      Integer :priority

      Float :min_distance
      Float :max_distance

      column :min_time, 'time', null: false, default: '00:00:00'
      column :max_time, 'time', null: false, default: '23:59:59'

      Boolean :active, null: false, default: true

      timestamps
    end

    create_table :travel_rules_departments do
      foreign_key :travel_rule_id, :travel_rules, null: false
      foreign_key :department_id, :departments, null: false

      index [:travel_rule_id, :department_id], unique: true
    end

    create_table :travel_rules_users do
      foreign_key :travel_rule_id, :travel_rules, null: false
      foreign_key :user_id, :users, null: false

      index [:travel_rule_id, :user_id], unique: true
    end

    create_table :travel_rules_work_roles do
      foreign_key :travel_rule_id, :travel_rules, null: false
      foreign_key :work_role_id, :work_roles, null: false

      index [:travel_rule_id, :work_role_id], unique: true
    end

    create_table :travel_rules_vehicles do
      foreign_key :travel_rule_id, :travel_rules, null: false
      foreign_key :vehicle_id, :vehicles, null: false

      index [:travel_rule_id, :vehicle_id], unique: true
    end
  end
end
