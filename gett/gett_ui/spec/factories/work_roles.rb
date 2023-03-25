FactoryGirl.define do
  factory :work_role do
    company { create :company }
    sequence(:name) { |n| "#{Faker::Company.profession} #{n}" }
  end
end
