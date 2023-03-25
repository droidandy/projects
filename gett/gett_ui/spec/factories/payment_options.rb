FactoryGirl.define do
  factory :payment_options do
    company_id    { create(:company).id }
    payment_types { ['account'] }
    default_payment_type 'account'
    invoicing_schedule   'weekly'
    payment_terms 14
  end
end
