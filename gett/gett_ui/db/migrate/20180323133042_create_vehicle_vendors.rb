Sequel.migration do
  change do
    create_table :vehicle_vendors do
      primary_key :id

      String :key, null: false, index: true
      String :name, null: false
      String :city, index: true
      Boolean :specialized, null: false, default: false

      timestamps
    end

    create_table :vehicle_vendors_vehicles do
      foreign_key :vehicle_vendor_id, :vehicle_vendors, null: false
      foreign_key :vehicle_id, :vehicles, null: false
      Boolean :active, null: false, default: true

      index [:vehicle_vendor_id, :vehicle_id], unique: true
    end

    alter_table :bookings do
      add_foreign_key :vehicle_vendor_id, :vehicle_vendors, index: true
    end
  end
end
