Sequel.migration do
  up do
    DB[:payment_options].where(payment_terms: 31).update(payment_terms: 30)
  end

  down do
    DB[:payment_options].where(payment_terms: 30).update(payment_terms: 31)
  end
end
