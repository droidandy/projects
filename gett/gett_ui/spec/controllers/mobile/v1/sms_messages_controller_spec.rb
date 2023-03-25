require 'rails_helper'

RSpec.describe Mobile::V1::SmsMessagesController, type: :controller do
  let(:passenger) { create(:passenger) }

  before { sign_in passenger }

  it_behaves_like 'service controller' do
    post :notify_driver do
      let(:service_class) { ::Bookings::NotifyDriver }

      let(:booking) { create(:booking, passenger: passenger) }

      params { {booking_id: booking.id, arrive_in: 5} }

      expected_service_attributes { {booking: booking, arrive_in: '5'} }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(400)
      end
    end
  end
end
