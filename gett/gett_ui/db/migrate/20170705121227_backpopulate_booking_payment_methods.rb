using Sequel::CoreRefinements

Sequel.migration do
  up do
    dataset = from(:bookings, :members, :companies)
      .where(
        :bookings[:payment_method] => nil,
        :bookings[:booker_id] => :members[:id],
        :members[:company_id] => :companies[:id]
      )

    dataset.where(:companies[:company_type] => 'enterprise').update(payment_method: 'account')
    dataset.where(:companies[:company_type] => 'affiliate').update(payment_method: 'cash')
  end
end
