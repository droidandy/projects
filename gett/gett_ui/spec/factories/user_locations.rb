FactoryGirl.define do
  factory :user_location do
    user { create(:passenger) }
    lat { Faker::Address.latitude.to_f.round(7) }
    lng { Faker::Address.longitude.to_f.round(7) }
  end
end
