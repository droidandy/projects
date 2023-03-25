FactoryGirl.define do
  factory :invoice do
    company
    type 'invoice'
    invoicing_schedule 'monthly'
    payment_terms 31
    billing_period_start { 1.month.ago.beginning_of_month }
    billing_period_end { 1.month.ago.end_of_month }
    overdue_at { 1.month.ago.end_of_month + 31.days }
    amount_cents 0
    paid_amount_cents 0
    paid_at nil
    paid_by_id nil

    trait :overdue do
      overdue_at { 1.month.ago.end_of_month }
    end

    trait :paid do
      paid_at { Time.current }
      amount_cents 100
      paid_amount_cents { amount_cents }
    end

    trait :partially_paid do
      paid_at { Time.current }
      amount_cents 1000
      paid_amount_cents 500
    end

    trait :paid_by_business_credit do
      amount_cents 0
      business_credit_cents 100
    end

    trait :under_review do
      under_review true
    end

    trait :expired do
      overdue_at { Date.current - Invoice::ALLOWED_OVERDUE_PERIOD - 1.day }
    end

    factory :cc_invoice do
      type 'cc_invoice'

      member
    end

    factory :credit_note do
      type 'credit_note'

      trait :with_lines do
        amount_cents 220

        after(:create) do |record|
          2.times do |i|
            create(:credit_note_line,
              credit_note:  record,
              booking:      create(:booking, :without_passenger, company: record.company),
              amount_cents: 100,
              vat:          i.odd? ? 100 * Settings.vat_rate : 0
            )
          end
        end
      end
    end
  end
end
