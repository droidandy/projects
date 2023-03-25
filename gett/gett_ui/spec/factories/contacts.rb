FactoryGirl.define do
  factory :contact do
    company_id { create(:company).id }
    phone      { Faker::PhoneNumber.phone_number(:gb) }
    mobile     { Faker::PhoneNumber.phone_number(:gb) }
    fax        { Faker::PhoneNumber.phone_number(:gb) }
    email      { Faker::Internet.email }
    first_name { Faker::Name.first_name }
    last_name  { Faker::Name.last_name }
    primary    true

    trait :billing do
      primary false
      address
    end

    trait :without_address do
      address nil
    end
  end
end
