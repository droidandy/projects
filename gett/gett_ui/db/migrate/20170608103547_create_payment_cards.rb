Sequel.migration do
  change do
    create_table :payment_cards do
      primary_key :id
      foreign_key :passenger_id, :users, null: false
      String :holder_name, null: false
      Integer :last_4, null: false
      Integer :expiration_month, null: false
      Integer :expiration_year, null: false
      Boolean :active, null: false, default: true
      String :token

      timestamps
    end
  end
end
