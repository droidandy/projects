FactoryGirl.define do
  factory :administrator do
    sequence(:email) { |i| "email_#{i}@example.com" }
    password 'Secure_Password'
  end
end
