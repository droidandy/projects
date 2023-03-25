Sequel.migration do
  change do
    add_column :companies, :critical_flag_due_on, Date
    add_column :bookings, :critical_flag, :boolean
  end
end
