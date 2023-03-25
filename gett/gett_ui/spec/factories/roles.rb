FactoryGirl.define do
  factory :role do
    name 'booker'

    factory :admin_role do
      name 'admin'
    end

    factory :passenger_role do
      name 'passenger'
    end
  end
end
