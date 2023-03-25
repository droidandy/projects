Sequel.migration do
  change do
    add_column :bookings, :room, String
  end
end
