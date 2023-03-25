FactoryGirl.define do
  factory :ddi do
    type 'standard'
    phone '+1234567890'

    trait :mega do
      type 'mega'
    end

    trait :key do
      type 'key'
    end

    trait :custom do
      type 'custom'
    end
  end
end
