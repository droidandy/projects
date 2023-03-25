FactoryGirl.define do
  factory :passenger_address do
    transient do
      address_line { Faker::Address.street_address }
    end

    passenger
    type 'home'

    after :build do |record, factory|
      record.address ||= create(:address, line: factory.address_line)
    end

    trait :home do
      type 'home'
    end

    trait :work do
      type 'work'
    end

    trait :favorite do
      type 'favorite'
      sequence(:name) { |n| "Favorite Address #{n}" }
    end
  end
end
