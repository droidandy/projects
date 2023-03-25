Sequel.migration do
  change do
    create_enum :pr_booking_type, %w(both asap future)

    alter_table :pricing_rules do
      add_column :booking_type, 'pr_booking_type', null: false, default: 'both'
      add_column :min_time, 'time', null: false, default: '00:00:00'
      add_column :max_time, 'time', null: false, default: '23:59:59'
    end
  end
end
