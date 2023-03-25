FactoryGirl.define do
  factory :reference_entry do
    booking_reference { create :booking_reference }
    value             { Faker::Lorem.sentence }
  end
end
