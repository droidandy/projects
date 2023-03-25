Sequel.migration do
  change do
    alter_table :booking_charges do
      add_column :vatable_ride_fees, Integer, null: false, default: 0
      add_column :non_vatable_ride_fees, Integer, null: false, default: 0
      add_column :service_fees, Integer, null: false, default: 0
      add_column :vatable_extra_fees, Integer, null: false, default: 0
      add_column :non_vatable_extra_fees, Integer, null: false, default: 0
    end
  end
end
