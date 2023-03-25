FactoryGirl.define do
  factory :company do
    sequence(:name) { |i| "Company #{i}" }
    salesman
    active true
    address
    fleet_id 3
    association :primary_contact, factory: :contact
    association :billing_contact, factory: :contact
  end
end
