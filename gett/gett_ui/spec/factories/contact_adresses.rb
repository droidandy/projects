FactoryGirl.define do
  factory :contact_address do
    company { create :contact }
    address { create :address }
  end
end
