require 'rails_helper'

RSpec.describe BookingFeedbacksController, type: :controller do
  let(:member)  { create :member }
  let(:booking) { create :booking, booker: member }

  before { sign_in member }

  it_behaves_like 'service controller', module: Feedbacks do
    post :create do
      params do
        {
          booking_id: booking.id,
          feedback: {rating: 4, message: 'ok'}
        }
      end

      expected_service_attributes do
        {
          booking: booking,
          params: as_params(rating: '4', message: 'ok')
        }
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
