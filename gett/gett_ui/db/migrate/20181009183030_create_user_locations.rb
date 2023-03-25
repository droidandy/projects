Sequel.migration do
  change do
    create_table :user_locations do
      primary_key :id
      foreign_key :user_id, :users, null: false, index: true
      Float :lat, null: false
      Float :lng, null: false

      timestamps
    end
  end
end
