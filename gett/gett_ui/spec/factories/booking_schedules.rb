FactoryGirl.define do
  factory :booking_schedule do
    trait :preset do
      custom false
      scheduled_ats { Sequel.pg_array([1.day.from_now, 2.days.from_now]) }
    end

    trait :custom do
      custom true
      scheduled_ats { Sequel.pg_array([3.days.from_now, 4.days.from_now]) }
    end
  end
end
