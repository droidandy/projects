Sequel.migration do
  shift_ids =
    Kernel.proc do |base|
      # temporarily remove FK constraints in `booking_addresses` and `booker_references`
      alter_table :booking_addresses do
        drop_foreign_key [:booking_id]
      end

      alter_table :booker_references do
        drop_foreign_key [:booking_id]
      end

      from(:bookings).update(id: Sequel[:id] + base)
      from(:booking_addresses).update(booking_id: Sequel[:booking_id] + base)
      from(:booker_references).update(booking_id: Sequel[:booking_id] + base)

      # update booking_id sequence so that new IDs start from 100_000
      run("SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id), #{(base > 0) ? base : 0}) FROM bookings))")

      # re-enable FK constraints in `booking_addresses` and `booker_references`
      alter_table :booking_addresses do
        add_foreign_key [:booking_id], :bookings
      end

      alter_table :booker_references do
        add_foreign_key [:booking_id], :bookings
      end
    end

  up do
    instance_exec(100_000, &shift_ids)
  end

  down do
    instance_exec(-100_000, &shift_ids)
  end
end
