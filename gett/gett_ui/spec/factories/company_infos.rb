FactoryGirl.define do
  factory :company_info do
    name { generate :company_name }
    active true
    cancellation_before_arrival_fee 0
    cancellation_after_arrival_fee 0
    gett_cancellation_before_arrival_fee 0
    gett_cancellation_after_arrival_fee 0
    get_e_cancellation_before_arrival_fee 0
    get_e_cancellation_after_arrival_fee 0
    phone_booking_fee 1.0
    international_booking_fee 0
    system_fx_rate_increase_percentage 0
    quote_price_increase_percentage 0
    quote_price_increase_pounds 0
    splyt_cancellation_before_arrival_fee 0
    splyt_cancellation_after_arrival_fee 0
    carey_cancellation_before_arrival_fee 0
    carey_cancellation_after_arrival_fee 0
    country_code 'GB'
  end
end
