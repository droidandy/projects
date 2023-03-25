Sequel.migration do
  change do
    create_table :feedbacks do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      foreign_key :user_id, :users, null: false
      Integer :rating
      String :message

      timestamps
    end
  end
end
