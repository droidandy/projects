FactoryGirl.define do
  factory :booking_reference do
    name    { Faker::Lorem.word }
    company { create :company }
    active true
    priority 1

    trait :inactive do
      active false
    end

    trait :mandatory do
      mandatory true
    end

    trait :validation_required do
      validation_required true
    end

    trait :cost_centre do
      cost_centre true
      name 'Cost Centre'
    end
  end
end
