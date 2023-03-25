require 'rails_helper'

RSpec.describe Splyt::BookingInfo do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking)               { create(:booking, :splyt) }
  let(:api_url)               { Settings.splyt.api_url }
  let(:url)                   { "#{api_url}/v2/bookings/#{booking.service_id}" }
  let(:supplier_service_id)   { 'IDDQDIDKFA' }
  let(:otp_code)              { '3620' }
  let(:message_from_supplier) { 'In case you cannot find your driver please stay in the arrival area' }
  let(:response) do
    {
      'consumer' => {},
      'provider' =>
        {
          '_id' => '5dfdaec32bceaa21ffed291ac',
          'logo' => 'https://image.splytech.io/parnter-logos/uploads/mozio.png',
          'self_link' => "v1/parnterns/5dfdaec32bceaa21ffed291ac",
          'display_name' => 'Mozio',
          'remote_booking_id' => supplier_service_id,
          'info' => {
            'otp_code' => otp_code,
            'passenger_message' => message_from_supplier
          }
        },
      'booking' => {}
    }
  end

  before { stub_request(:get, url).to_return(status: 200, body: response.to_json) }

  describe '#execute' do
    it 'sends get request and returns driver info' do
      expect(service.execute.result.code).to eq(200)
      expect(service.execute.result.data).to eq(response)
    end
  end

  describe '#normalized_response' do
    let(:normalized_response) do
      {
        supplier_service_id: supplier_service_id,
        message_from_supplier: message_from_supplier,
        otp_code: otp_code
      }
    end

    it 'maps response to new hash' do
      expect(service.execute.normalized_response).to eq(normalized_response)
    end
  end
end
