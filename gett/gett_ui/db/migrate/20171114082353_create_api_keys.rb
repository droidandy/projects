Sequel.migration do
  change do
    create_table :api_keys do
      primary_key :id
      foreign_key :user_id, :users, null: false
      String :key

      index :key, unique: true

      timestamps
    end
  end
end
