Sequel.migration do
  change do
    create_enum :recurrence_preset_type, %w(daily weekly monthly)

    create_table :booking_schedules do
      primary_key :id

      Bool :custom, null: false, default: false
      column :preset_type, :recurrence_preset_type
      Integer :recurrence_factor
      Time :starting_at
      Time :ending_at
      Bool :workdays_only
      Integer :weekdays, null: false, default: 0
      column :scheduled_ats, 'timestamp[]', default: Sequel.pg_array([], :timestamp)

      timestamps
    end

    alter_table :bookings do
      add_foreign_key :schedule_id, :booking_schedules, index: true
      add_column :recurring_next, :bool, default: false
    end
  end
end
