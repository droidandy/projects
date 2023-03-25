Sequel.migration do
  change do
    alter_table :companies do
      add_column :bookings_validation_enabled, :boolean, null: false, default: false
    end
  end
end
