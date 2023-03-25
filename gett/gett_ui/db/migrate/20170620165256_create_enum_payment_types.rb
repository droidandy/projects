using Sequel::CoreRefinements

Sequel.migration do
  up do
    create_enum :payment_type, %w(account cash passenger_payment_card)
    add_column :payment_options, :payment_types, 'payment_type[]', default: []

    from(:payment_options)
      .update(payment_types: [:payment_type].pg_array(:payment_type))

    drop_column :payment_options, :payment_type
  end

  down do
    add_column :payment_options, :payment_type, String, null: false, default: 'account'

    from(:payment_options).update(payment_type: :payment_types.pg_array[1])

    drop_column :payment_options, 'payment_types'
    drop_enum :payment_type
  end
end
