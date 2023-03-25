require 'rails_helper'

RSpec.describe Incomings::GetE::TripPositionUpdateHandler, type: :service do
  let(:service) { Incomings::GetE::TripPositionUpdateHandler.new(payload: payload) }
  let(:payload) do
    {
      data: {
        Unid: 'Unid',
        Status: 'Completed',
        Driver: {
          Name: 'John',
          Phone: '31111111111',
          Location: {
            Latitude: 1,
            Longitude: 1
          }
        }
      }
    }.with_indifferent_access
  end
  let(:incoming) { Incoming.last }

  context 'when valid' do
    let!(:booking) { create(:booking, service_id: 'Unid') }
    let!(:driver) { create :booking_driver, booking: booking, name: 'John', phone_number: '31111111111' }

    it 'runs Bookings::DriverUpdater' do
      expect(Bookings::DriverUpdater).to receive(:new).with(
        booking: booking,
        params: {
          name: 'John',
          phone_number: '31111111111',
          lat: 1,
          lng: 1
        }
      ).and_return(double(execute: true))
      expect{ service.execute }.to change(Incoming, :count).by(1)
      expect(service).to be_success
      expect(incoming.api_errors).to be_blank
    end
  end

  context 'when booking does not exist' do
    it 'creates Incoming record with errors' do
      expect{ service.execute }.to change(Incoming, :count).by(1)
      expect(service).to be_success
      expect(incoming.api_errors).to be_present
    end
  end
end
