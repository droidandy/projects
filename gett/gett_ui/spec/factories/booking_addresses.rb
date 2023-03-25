FactoryGirl.define do
  factory :booking_address do
    booking_id { create(:booking).id }
    address_id { create(:address).id }

    trait :pickup do
      address_type 'pickup'
    end

    trait :destination do
      address_type 'destination'
    end

    trait :stop do
      address_type 'stop'
      stop_info { {stop: 'info'} }
    end
  end
end
