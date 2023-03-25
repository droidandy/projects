Sequel.migration do
  up do
    create_enum :pr_rule_type, %w(point_to_point area)
    create_enum :pr_price_type, %w(fixed meter)

    create_table :pricing_rules do
      primary_key :id
      foreign_key :company_id, :companies

      String :name, null: false
      column :vehicle_types, 'text[]', default: Sequel.pg_array([], :text), null: false
      boolean :active, null: false, default: true

      pr_rule_type :rule_type, null: false
      pr_price_type :price_type, null: false

      foreign_key :pickup_address_id, :addresses
      foreign_key :destination_address_id, :addresses

      column :pickup_polygon, 'geography(POLYGON)'
      column :destination_polygon, 'geography(POLYGON)'

      column :pickup_point, 'geography(POINT)'
      column :destination_point, 'geography(POINT)'

      Float :base_fare
      Float :initial_cost
      Float :after_distance
      Float :after_cost

      timestamps
    end
  end

  down do
    drop_table :pricing_rules
    drop_enum :pr_price_type
    drop_enum :pr_rule_type
  end
end
