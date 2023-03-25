Sequel.migration do
  change do
    alter_table :booking_drivers do
      add_column :location_updated_at, DateTime
    end
  end
end
