FactoryBot.define do
  factory :review do
    driver { create(:user, :with_driver_role) }
    sequence(:attempt_number)

    trait :scheduled do
      scheduled_at { Time.now }
    end

    trait :checked_in do
      checkin_at { Time.now }
    end

    trait :assigned do
      agent
      assigned_at { Time.now }
    end

    trait :started do
      training_start_at { Time.now }
    end

    trait :finished do
      training_start_at { Time.now }
      training_end_at { Time.now }
    end
  end
end
