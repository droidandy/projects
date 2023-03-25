FactoryGirl.define do
  factory :pricing_rule do
    company
    name 'Pricing Rule'

    rule_type 'point_to_point'
    vehicle_types ['Standard']
    booking_type 'both'
    time_frame 'daily'
    min_time '00:00'
    max_time '23:59'
    price_type 'fixed'
    base_fare 10

    pickup_address { create(:address) }
    destination_address { create(:address) }

    pickup_point(lat: 0, lng: 0)
    destination_point(lat: 10, lng: 10)

    pickup_polygon [{ lat: 0, lng: 0 }, { lat: 0.5, lng: 0 }, { lat: 0, lng: 0.5 }]
    destination_polygon [{ lat: 10, lng: 10 }, { lat: 10.5, lng: 10 }, { lat: 10, lng: 10.5 }]

    trait(:point_to_point) {}

    trait :meter do
      price_type 'meter'
      initial_cost 5
      after_distance 3
      after_cost 1
    end

    trait :area do
      rule_type 'area'
      price_type 'meter'
      initial_cost 5
      after_distance 3
      after_cost 1
      pickup_polygon [{ lat: -1, lng: -1 }, { lat: 11, lng: -1 }, {lat: 11, lng: 11}, {lat: -1, lng: 11 }]
    end

    trait :custom do
      time_frame 'custom'

      starting_at { 1.day.ago }
      ending_at { 1.day.from_now }
    end
  end
end
