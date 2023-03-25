Sequel.migration do
  change do
    create_enum :pr_time_frame, %w(daily custom)

    alter_table :pricing_rules do
      add_column :time_frame, 'pr_time_frame', null: false, default: 'daily'
      add_column :starting_at, DateTime
      add_column :ending_at, DateTime

      set_column_allow_null :min_time
      set_column_allow_null :max_time
    end
  end
end
