FactoryGirl.define do
  factory :company_credit_rate do
    company { create :company }

    trait :active do
      active true
    end

    trait :inactive do
      active false
    end
  end
end
