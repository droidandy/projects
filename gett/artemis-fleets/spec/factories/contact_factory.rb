FactoryGirl.define do
  factory :contact do
    first_name 'John'
    last_name 'Doe'
    email 'm@il.com'
    phone '123456'
    mobile '123456'
    fax '123456'
    address
  end
end
