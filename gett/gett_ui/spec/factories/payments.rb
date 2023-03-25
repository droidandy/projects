FactoryGirl.define do
  factory :payment do
    booking { create :booking }
    amount_cents 500
    sequence(:payments_os_id) { |n| "payments_os_id_#{n}" }
    currency 'GBP'
    status 'initialized'

    trait :pending do
      status 'pending'
    end

    trait :captured do
      status 'captured'
    end

    trait :pending do
      status 'pending'
    end

    trait :failed do
      status 'failed'
    end
  end
end
