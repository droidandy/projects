FactoryGirl.define do
  factory :alert do
    booking
    type 'order_changed'
    level 'medium'
    message 'Alert message.'
  end

  trait :has_no_driver do
    type 'has_no_driver'
  end

  trait :driver_is_late do
    type 'driver_is_late'
  end
end
