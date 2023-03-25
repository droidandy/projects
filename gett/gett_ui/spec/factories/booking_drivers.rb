FactoryGirl.define do
  factory :booking_driver_base, class: 'BookingDriver' do
    booking
    rating              { rand(1..6) }
    location_updated_at { Time.current }
  end

  factory :booking_driver, parent: :booking_driver_base do
    name         { Faker::Name.first_name }
    phone_number { '+380995555555' }
  end

  feature_factory :booking_driver, parent: :booking_driver_base do
    name         { Faker::Name.name }
    phone_number { Faker::PhoneNumber.phone_number(:gb) }
    image_url    { Faker::Avatar.image }
    vehicle      { { color: 'Black', model: 'Mazda 3', license_plate: Faker::Number.number(16)} }
    trip_rating  nil
  end
end
