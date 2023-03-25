FactoryGirl.define do
  factory :special_requirement do
    sequence(:key) { |n| "Key #{n}" }
    sequence(:label) { |n| "Label #{n}" }

    trait :ot do
      service_type 'ot'
    end
  end
end
