Sequel.migration do
  change do
    create_table :bookers_passengers do
      foreign_key :booker_id, :users, null: false
      foreign_key :passenger_id, :users, null: false

      index [:booker_id, :passenger_id], unique: true
    end
  end
end
