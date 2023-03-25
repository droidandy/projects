FactoryGirl.define do
  factory :vehicle do
    name { Bookings::Vehicle::VEHICLE_NAMES.sample }

    trait :gett do
      service_type :gett
      value 'product1'
      earliest_available_in 30
    end

    trait :one_transport do
      service_type :ot
      name 'Standard'
      value 'Saloon_Standard'
      earliest_available_in 60
      pre_eta 30
    end

    trait :get_e do
      service_type :get_e
      value 'Comfort Sedan'
      earliest_available_in 60
      pre_eta 30
    end

    trait :manual do
      service_type :manual
      value 'Special'
      earliest_available_in 60
      pre_eta 30
    end

    trait :carey do
      service_type :carey
      value 'Chauffeur'
      earliest_available_in 60
    end

    trait :splyt do
      service_type :splyt
      value 'Standard'
      earliest_available_in 0
      pre_eta 0
    end
  end
end
