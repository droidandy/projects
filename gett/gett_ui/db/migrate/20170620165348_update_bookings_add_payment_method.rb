Sequel.migration do
  change do
    alter_table :bookings do
      add_column :payment_method, :payment_type
    end
  end
end
