FactoryGirl.define do
  factory :airport do
    sequence(:name) { |n| "Airport #{n}" }
    sequence(:iata) { |n| "RI#{n}" }
    lat { Faker::Address.latitude.to_f }
    lng { Faker::Address.longitude.to_f }
  end
end
