require 'rails_helper'

RSpec.describe Incomings::GetE::DriverUpdateHandler, type: :service do
  let(:service) { Incomings::GetE::DriverUpdateHandler.new(payload: payload) }
  let(:payload) do
    {
      data: {
        Unid: 'Unid',
        Driver: {
          Name: 'John',
          Phone: '31111111111'
        }
      }
    }.with_indifferent_access
  end
  let(:incoming) { Incoming.last }

  context 'when valid' do
    let!(:booking) { create(:booking, service_id: 'Unid') }

    it 'calls Bookings::DriverUpdater service' do
      expect(Bookings::DriverUpdater).to receive(:new)
        .with(booking: booking, params: {name: 'John', phone_number: '31111111111'})
        .and_return(double(execute: true))

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
