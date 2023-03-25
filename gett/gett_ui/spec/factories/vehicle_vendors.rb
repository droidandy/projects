FactoryGirl.define do
  factory :vehicle_vendor do
    key 'ABC'
    name 'ABC Taxi'
    city 'london'
    specialized false
    phone { Faker::PhoneNumber.phone_number(:gb) }
  end
end
