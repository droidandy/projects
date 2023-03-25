Sequel.migration do
  change do
    alter_table :bookings do
      add_column :vip, :boolean, default: false, null: false
      add_column :ftr, :boolean, default: false, null: false
    end
  end
end
