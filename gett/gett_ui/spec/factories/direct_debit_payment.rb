FactoryGirl.define do
  factory :direct_debit_payment do
    direct_debit_mandate
    invoice
    go_cardless_payment_id 'payment_id'
    amount_cents 100
    currency 'GBP'
    status 'pending'

    trait :successful do
      status 'successful'
    end
  end
end
