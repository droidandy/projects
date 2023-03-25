require 'rails_helper'

RSpec.describe Admin::BookingMessagesController, type: :controller do
  let(:admin)   { create :user, :admin }
  let(:booking) { create :booking }

  let(:booking_message) { create :booking_message }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::BookingMessages do
    post :create do
      params do
        {booking_id: booking.id, text: 'Text', phones: ['+44712341234', '+44700001111']}
      end

      expected_service_attributes do
        {booking: booking, text: 'Text', phones: ['+44712341234', '+44700001111']}
      end

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
