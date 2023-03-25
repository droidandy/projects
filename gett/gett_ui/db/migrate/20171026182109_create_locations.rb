Sequel.migration do
  up do
    extension :address_lookup_triggers

    create_table :locations do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      foreign_key :address_id, :addresses, null: false
      String :name, null: false
      String :pickup_message
      String :destination_message
      Boolean :default, default: false

      timestamps

      index [:company_id, :name], unique: true
      index [:company_id, :address_id], unique: true
      index [:company_id, :default], unique: true, where: { default: true }
    end

    add_address_reference(:locations)
  end

  down do
    extension :address_lookup_triggers

    drop_address_reference(:locations)
    drop_table :locations
  end
end
