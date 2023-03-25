Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :international_booking_fee, Float, null: false, default: 0
    end

    alter_table :booking_charges do
      add_column :international_booking_fee, Integer, null: false, default: 0
    end

    alter_table :bookings do
      rename_column :international, :international_flag
    end
  end
end
