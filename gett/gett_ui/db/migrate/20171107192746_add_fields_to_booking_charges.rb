Sequel.migration do
  up do
    alter_table :booking_charges do
      add_column :additional_fee, Integer, null: false, default: 0
      add_column :sales_tax, Integer, null: false, default: 0

      add_column :extra1, Integer, null: false, default: 0
      add_column :extra2, Integer, null: false, default: 0
      add_column :extra3, Integer, null: false, default: 0
    end

    from(:booking_charges).where{ extra_fees > 0 }.update(extra1: :extra_fees)

    alter_table :booking_charges do
      drop_column :extra_fees
    end
  end

  down do
    alter_table :booking_charges do
      add_column :extra_fees, Integer, null: false, default: 0
    end

    from(:booking_charges).update(extra_fees: Sequel[:extra1] + Sequel[:extra2] + Sequel[:extra3])

    alter_table :booking_charges do
      drop_column :additional_fee
      drop_column :sales_tax

      drop_column :extra1
      drop_column :extra2
      drop_column :extra3
    end
  end
end
