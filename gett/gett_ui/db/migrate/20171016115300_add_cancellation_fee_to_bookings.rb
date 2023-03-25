Sequel.migration do
  change do
    alter_table :bookings do
      add_column :cancellation_fee, :boolean, default: true
    end
  end
end
