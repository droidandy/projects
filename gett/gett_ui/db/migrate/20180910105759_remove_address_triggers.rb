Sequel.migration do
  up do
    extension :pg_triggers, :address_lookup_triggers

    drop_trigger(:addresses, "pgt_addresses_autodestroy_trg", if_exists: true)
    drop_function("pgt_addresses_autodestroy_fn", if_exists: true)

    drop_address_reference(:contacts)
    drop_address_reference(:booking_addresses)
    drop_address_reference(:passenger_addresses)
    drop_address_reference(:company_infos)
    drop_address_reference(:company_infos, prefix: 'legal_')
    drop_address_reference(:locations)

    drop_function("pgt_cc_company_addresses_address_reference_fn", if_exists: true)
  end

  down do
    extension :pg_triggers, :address_lookup_triggers

    add_address_reference(:contacts)
    add_address_reference(:booking_addresses)
    add_address_reference(:passenger_addresses)
    add_address_reference(:company_infos)
    add_address_reference(:company_infos, column_name: :legal_address_id, prefix: 'legal_')
    add_address_reference(:locations)
  end
end
