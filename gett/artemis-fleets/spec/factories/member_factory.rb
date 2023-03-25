FactoryGirl.define do
  factory :member do
    sequence(:email) { |i| "member_#{i}@example.com" }
    password 'Secure_Password'

    company
    first_name 'John'
    last_name 'Doe'
    phone '1 2345 678 910'
    mobile '1 2345 678 910'
    role 'admin'
  end
end
