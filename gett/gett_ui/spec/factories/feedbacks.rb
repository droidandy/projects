FactoryGirl.define do
  factory :feedback do
    booking
    association :user, factory: :member
    rating 5
    message 'Great service!'
  end
end
