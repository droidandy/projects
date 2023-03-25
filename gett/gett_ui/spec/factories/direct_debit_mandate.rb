FactoryGirl.define do
  factory :direct_debit_mandate do
    company
    association :created_by, factory: :member
    go_cardless_redirect_flow_id 'flow_id'
    status 'initiated'

    trait :active do
      go_cardless_mandate_id 'mandate_id'
      status 'active'
    end
  end
end
