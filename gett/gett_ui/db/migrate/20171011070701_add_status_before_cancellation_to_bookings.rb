Sequel.migration do
  change do
    alter_table :bookings do
      add_column :status_before_cancellation, :booking_status
    end
  end
end
