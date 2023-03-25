FactoryGirl.define do
  factory :department do
    company { create :company }
    sequence(:name) { |n| "#{Faker::Commerce.department} #{n}" }
  end
end
