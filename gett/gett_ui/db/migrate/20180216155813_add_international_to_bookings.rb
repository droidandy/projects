using Sequel::CoreRefinements

Sequel.migration do
  up do
    add_column :bookings, :international, :boolean, default: false

    get_e_booking_ids = from(:bookings).join(:vehicles, id: :vehicle_id).where(service_type: 'get_e')
      .select(:bookings[:id])

    from(:bookings).where(id: get_e_booking_ids).update(international: true)
  end

  down do
    drop_column :bookings, :international
  end
end
