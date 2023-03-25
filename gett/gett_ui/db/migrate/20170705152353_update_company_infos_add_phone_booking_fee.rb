Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :phone_booking_fee, :Float, null: false, default: 1.0
    end

    alter_table :bookings do
      add_column :phone_booking, :Boolean, null: false, default: false
    end
  end
end
