Sequel.migration do
  change do
    create_table :user_devices do
      primary_key :id
      foreign_key :user_id, :users, null: false, index: true
      String :token, null: false, index: true, unique: true

      timestamps
    end
  end
end
