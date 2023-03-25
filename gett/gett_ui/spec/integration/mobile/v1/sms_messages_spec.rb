require 'swagger_helper'

describe 'SMS Messages API', swagger_doc: 'mobile/v1/swagger.json' do
  let(:passenger)      { create(:passenger) }
  let(:booking)        { create(:booking, :with_driver, passenger: passenger) }
  let(:Authorization)  { JsonWebToken.encode(id: passenger.id) }

  path '/sms_messages/notify_driver' do
    post 'Send SMS notification to driver' do
      tags 'SMS Messages'
      consumes 'application/json'
      produces 'application/json'
      security [ api_key: [] ]

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          booking_id: {type: :number},
          arrive_in: {type: :number}
        },
        required: [:booking_id, :arrive_in]
      }

      let(:params) { {booking_id: booking.id, arrive_in: 5} }

      response '200', 'SMS was successfully sent to the driver' do
        run_test!
      end

      response '400', 'sms was not sent' do
        let(:booking) { create(:booking, passenger: passenger) }

        run_test!
      end
    end
  end
end
