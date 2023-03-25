Sequel.migration do
  change do
    create_table :passenger_addresses do
      primary_key :id
      foreign_key :passenger_id, :users, null: false
      foreign_key :address_id, :addresses, null: false
      Boolean :work, null: false, default: false

      index [:passenger_id, :address_id], unique: true
    end
  end
end
