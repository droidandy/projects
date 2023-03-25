Sequel.migration do
  change do
    alter_table :bookings do
      add_column :lock_version, Integer, null: false, default: 0
    end
  end
end
