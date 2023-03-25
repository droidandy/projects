Sequel.migration do
  up do
    alter_table :travel_rules do
      add_column :cheapest, :boolean, null: false, default: false
    end

    from(:travel_rules)
      .update(cheapest: Sequel.function(:coalesce, Sequel[:price_setting] =~ 'cheapest', false))

    alter_table :travel_rules do
      drop_column :price_setting
    end

    drop_enum :tr_price_setting
  end

  down do
    create_enum :tr_price_setting, %w(fastest cheapest)

    alter_table :travel_rules do
      add_column :price_setting, :tr_price_setting
    end

    from(:travel_rules)
      .where(cheapest: true)
      .update(price_setting: 'cheapest')

    alter_table :travel_rules do
      drop_column :cheapest
    end
  end
end
