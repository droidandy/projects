FactoryGirl.define do
  factory :location do
    sequence(:name) { |n| "Office Location #{n}" }
    company { create :company }
    address { create :address }
    pickup_message ''
    destination_message ''
    default false

    trait :default do
      default true
    end

    trait :with_message do
      message 'message to driver'
    end
  end
end
