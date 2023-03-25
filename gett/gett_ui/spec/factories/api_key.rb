FactoryGirl.define do
  factory :api_key do
    key { SecureRandom.hex }
    user { create :user }
  end
end
