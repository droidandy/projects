Sequel.migration do
  up do
    alter_table :bookings do
      add_column :cost_excl_fee, Integer, null: false, default: 0
      rename_column :cost_cents, :cost_incl_fee
    end
  end

  down do
    alter_table :bookings do
      rename_column :cost_incl_fee, :cost_cents
      drop_column :cost_excl_fee
    end
  end
end
