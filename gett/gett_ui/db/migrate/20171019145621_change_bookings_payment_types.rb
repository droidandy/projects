using Sequel::CoreRefinements

Sequel.migration do
  no_transaction

  up do
    add_enum_value :payment_type, 'personal_payment_card', if_not_exists: true
    add_enum_value :payment_type, 'business_payment_card', if_not_exists: true

    booking_ids = DB[:bookings]
      .select(:bookings[:id])
      .join(:payment_cards, id: :payment_card_id)

    from(:bookings)
      .where(id: booking_ids.where(:payment_cards[:personal]))
      .update(payment_method: 'personal_payment_card')

    from(:bookings)
      .where(id: booking_ids.where(~:payment_cards[:personal]))
      .update(payment_method: 'business_payment_card')
  end

  down do
    from(:bookings)
      .where(payment_method: ['personal_payment_card', 'business_payment_card'])
      .update(payment_method: 'passenger_payment_card')
  end
end
