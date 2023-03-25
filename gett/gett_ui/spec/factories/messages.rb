FactoryGirl.define do
  sequence(:message_body) { |n| "Message #{n}" }

  factory :message do
    body    { generate(:message_body) }
    sender  { create(:member) }
    company { create(:company) }
    message_type 'internal'

    trait :external do
      company nil
      sender { create(:user) }
      message_type 'external'
    end

    trait :personal do
      sender  nil
      company nil
      message_type 'personal'
      recipient { create(:passenger) }
    end

    trait :push do
      sender  nil
      company nil
      message_type 'push'
      recipient { create(:passenger) }
      body { {notification: {body: generate(:message_body)}}.to_json }
    end

    trait :deployment do
      company nil
      sender { create(:user) }
      message_type 'deployment'
    end
  end
end
