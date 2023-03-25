FactoryGirl.define do
  factory :credit_note_line do
    credit_note
    booking
    amount_cents 100

    trait :vatable do
      vat { amount_cents * Settings.vat_rate }
    end
  end
end
