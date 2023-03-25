FactoryGirl.define do
  factory :drivers_channel do
    channel { Faker::Crypto.md5 }
    location { [Faker::Address.latitude, Faker::Address.longitude] }
    valid_until { 1.day.from_now }

    trait :expired do
      valid_until { DateTime.current - 1.minute }
    end
  end
end
