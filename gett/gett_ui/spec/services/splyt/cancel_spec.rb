require 'rails_helper'

RSpec.describe Splyt::Cancel do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking)        { create(:booking, :splyt, pickup_address: pickup_address, vehicle: vehicle) }
  let(:pickup_address) { create(:address, :baker_street) }
  let(:vehicle)        { create(:vehicle, :splyt) }
  let(:api_url)        { Settings.splyt.api_url }

  describe '#execute' do
    let(:url) { "#{api_url}/v2/bookings/#{booking.service_id}" }

    before { stub_request(:patch, url).to_return(status: 200) }

    it 'sends patch request and returns success result' do
      expect(service.execute.result.code).to eq(200)
    end
  end
end
