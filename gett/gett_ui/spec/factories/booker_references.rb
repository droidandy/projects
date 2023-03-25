FactoryGirl.define do
  factory :booker_reference do
    value   { Faker::Lorem.word }
    booking { create :booking }
    booking_reference_name { Faker::Lorem.word }
  end
end
