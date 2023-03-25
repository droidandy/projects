require 'rails_helper'

RSpec.describe Admin::BookingPricingController, type: :controller do
  let(:admin)   { create :user, :admin }
  let(:booker)  { create :member }
  let(:booking) { create :booking, booker: booker }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Bookings do
    get :show do
      let(:service_class) { Admin::Bookings::PricingForm }

      params { { booking_id: booking.id } }

      expected_service_attributes { { booking: booking } }

      stub_service(result: 'pricing form data')

      expected_response(200 => 'pricing form data')
    end

    put :update do
      let(:service_class) { Admin::Bookings::PricingUpdate }

      params { { booking_id: booking.id, pricing: {booking: {status: 'completed'}, charges: {fare_cost: '123', cancellation_fee: '456'} } } }

      expected_service_attributes { { booking: booking, params: as_params(booking: {status: 'completed'}, charges: {fare_cost: '123', cancellation_fee: '456'}) } }

      on_success do
        stub_service(show_result: 'booking')
        expected_response(200 => 'booking')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
