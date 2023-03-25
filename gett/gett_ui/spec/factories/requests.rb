FactoryGirl.define do
  factory :request do
    url { Faker::Internet.url }
  end
end
