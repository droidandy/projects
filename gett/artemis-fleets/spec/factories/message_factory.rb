FactoryGirl.define do
  factory :message do
    body 'test message body'
    title 'John Doe'
    association :sender, factory: :member
    association :company
  end
end
