FactoryGirl.define do
  factory :company_signup_request do
    name 'New company name'

    country      { Faker::Address.country }
    user_name    { Faker::Name.name }
    phone_number { Faker::PhoneNumber.phone_number(:gb) }
    email        { Faker::Internet.email }
    comment      { Faker::Lorem.sentence }
  end
end
