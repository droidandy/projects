require 'rails_helper'

RSpec.describe Splyt::Receipt do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking)        { create(:booking, :splyt, pickup_address: pickup_address, vehicle: vehicle) }
  let(:pickup_address) { create(:address, :baker_street) }
  let(:vehicle)        { create(:vehicle, :splyt) }
  let(:api_url)        { Settings.splyt.api_url }
  let(:response)       { { 'receipt' => { 'amount' => 1111 } } }
  let(:url)            { "#{api_url}/v2/bookings/#{booking.service_id}/receipt" }

  before { stub_request(:get, url).to_return(status: 200, body: response.to_json) }

  describe '#execute' do
    it 'sends get request and returns amount' do
      expect(service.execute.result.code).to eq(200)
      expect(service.execute.result.data).to eq(response)
    end
  end

  describe '#normalized_response' do
    let(:normalized_response) { { amount: 1111 } }

    it 'maps response to new hash' do
      expect(service.execute.normalized_response).to eq(normalized_response)
    end
  end
end
