FactoryGirl.define do
  factory :csv_report do
    company { create :company }
    sequence(:name) { |n| "Scheduled CSV report #{n}" }
    recurrence 'monthly'
    recurrence_starts_at Time.current
    recipients { Faker::Internet.email }
    headers company_name: true, company_address: true
  end

  trait :monthly do
    recurrence 'monthly'
  end

  trait :weekly do
    recurrence 'weekly'
  end

  trait :daily do
    recurrence 'daily'
  end
end
