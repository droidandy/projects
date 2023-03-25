using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :bookings do
      add_column :billed, :boolean, null: false, default: false
    end

    from(:bookings)
      .update(
        billed:
          from(:bookings_invoices).where(booking_id: :bookings[:id]).select(1).exists |
          from(:payments).where(booking_id: :bookings[:id], status: 'captured').select(1).exists
      )
  end

  down do
    alter_table :bookings do
      drop_column :billed
    end
  end
end
