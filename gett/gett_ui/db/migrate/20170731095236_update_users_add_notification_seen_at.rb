Sequel.migration do
  change do
    alter_table :users do
      add_column :notification_seen_at, DateTime
    end
  end
end
