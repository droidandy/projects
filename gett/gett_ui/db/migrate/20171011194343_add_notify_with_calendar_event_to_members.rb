Sequel.migration do
  change do
    alter_table :members do
      add_column :notify_with_calendar_event, 'Boolean', default: false, null: false
    end
  end
end
