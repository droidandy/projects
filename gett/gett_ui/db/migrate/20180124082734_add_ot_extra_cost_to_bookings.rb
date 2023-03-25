Sequel.migration do
  change do
    alter_table :bookings do
      add_column :ot_extra_cost, Integer, null: false, default: 0
    end
  end
end
