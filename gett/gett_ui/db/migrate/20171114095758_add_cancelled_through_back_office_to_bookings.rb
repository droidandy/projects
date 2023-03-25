Sequel.migration do
  change do
    add_column :bookings, :cancelled_through_back_office, :boolean, null: false, default: false
  end
end
