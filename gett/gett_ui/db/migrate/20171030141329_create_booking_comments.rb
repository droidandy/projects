Sequel.migration do
  change do
    create_table :booking_comments do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      foreign_key :user_id, :users, null: false
      String :text

      timestamps
    end
  end
end
