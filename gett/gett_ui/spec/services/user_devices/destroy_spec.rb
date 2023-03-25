require 'rails_helper'

RSpec.describe UserDevices::Destroy, type: :service do
  subject(:service) { described_class.new(token: user_device_token) }

  let(:token)        { SecureRandom.hex }
  let(:passenger)    { create(:passenger) }
  let!(:user_device) { create(:user_device, user: passenger, token: token) }

  describe '#execute' do
    service_context { {user: passenger} }

    context 'when device does not exist' do
      let(:user_device_token) { SecureRandom.hex }

      it 'is not remove device' do
        expect{ service.execute }.to change(passenger.user_devices_dataset, :count).by(0)
      end
    end

    context 'when device exists' do
      let(:user_device_token) { token }

      it 'deactivates device' do
        expect{ service.execute }.to change(passenger.user_devices_dataset, :count).by(0)
          .and change { user_device.reload.active? }.from(true).to(false)
      end
    end
  end
end
