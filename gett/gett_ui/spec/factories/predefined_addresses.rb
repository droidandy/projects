FactoryGirl.define do
  factory :predefined_address do
    line { Faker::Address.street_address }
    lat { Faker::Address.latitude.to_f }
    lng { Faker::Address.longitude.to_f }
    postal_code { Faker::Address.postcode }
    city { Faker::Address.city }
    street_name { Faker::Address.street_name }

    trait :with_airport do
      airport { create(:airport) }
    end
  end
end
