FactoryGirl.define do
  factory :payment_card do
    card_number { '411111111111' + rand(1_000...10_000).to_s }
    personal true
    default false
    cvv '111'

    passenger        { create(:passenger) }
    holder_name      { Faker::Name.name }
    expiration_month { Time.current.month }
    expiration_year  { Time.current.year + 1 }
    sequence(:token) { |n| "Token#{n}" }

    trait :personal do
      personal true
    end

    trait :business do
      personal false
    end

    trait :company do
      passenger nil
      holder_name { Faker::Name.name }
      company { create :company }
    end

    trait :expired do
      expiration_month { 1.month.ago.month }
      expiration_year  { 1.month.ago.year }
    end

    trait :disabled do
      active false
    end
  end
end
