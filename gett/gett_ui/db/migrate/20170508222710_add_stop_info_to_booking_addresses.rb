Sequel.migration do
  up do
    add_column :booking_addresses, :stop_info, :jsonb

    from(:booking_addresses)
      .where(address_type: 'stop')
      .update(stop_info: Sequel.pg_jsonb(name: 'Some user', phone: '79998887766'))
  end

  down do
    drop_column :booking_addresses, :stop_info
  end
end
