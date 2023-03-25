FactoryGirl.define do
  factory :travel_reason do
    company { create :company }
    sequence(:name) { |n| "#{Faker::Commerce.product_name} #{n}" }

    trait :hw do
      name 'Home to Work'
    end

    trait :wh do
      name 'Work to Home'
    end

    trait :ww do
      name 'Work to Work'
    end
  end
end
