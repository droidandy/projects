FactoryGirl.define do
  factory :user_device do
    user { create(:passenger) }
    token { SecureRandom.hex }
    uuid { SecureRandom.hex }
    active true

    trait :inactive do
      active false
    end
  end
end
