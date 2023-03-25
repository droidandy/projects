require 'rails_helper'

RSpec.describe UserDevices::Create, type: :service do
  subject(:service) { described_class.new(uuid: device_uuid, device_attrs: device_attrs) }

  let(:token)        { SecureRandom.hex }
  let(:uuid)         { SecureRandom.hex }
  let(:device_attrs) { { token: token, device_type: 'samsung', os_type: 'android', client_os_version: '1.0.0', device_network_provider: 'vodafone' } }
  let(:passenger)    { create(:passenger) }
  let!(:user_device) do
    create(:user_device, :inactive,
      user: passenger,
      token: token,
      uuid: uuid,
      device_type: device_attrs[:device_type],
      os_type: device_attrs[:os_type],
      client_os_version: device_attrs[:client_os_version],
      device_network_provider: device_attrs[:device_network_provider])
  end

  service_context { { user: passenger } }

  describe '#execute' do
    context 'when device does not exist' do
      let(:device_uuid) { SecureRandom.hex }
      it 'creates new UserDevice record' do
        expect{ service.execute }.to change(UserDevice, :count).by(1)
      end
    end

    context 'when device exists update' do
      subject(:service)       { described_class.new(uuid: device_uuid, device_attrs: new_device_attrs) }
      let(:new_device_attrs)  { { token: token, device_type: 'samsung', os_type: 'ios', client_os_version: '1.1.3', device_network_provider: 'O2' } }
      let(:device_uuid)       { uuid }

      it 'does not create new UserDevice' do
        expect{ service.execute }.to change{ user_device.reload.os_type }.from('android').to('ios')
          .and change { user_device.reload.client_os_version }.from('1.0.0').to('1.1.3')
          .and change { user_device.reload.device_network_provider }.from('vodafone').to('O2')
          .and change { user_device.reload.active? }.from(false).to(true)
          .and change(UserDevice, :count).by(0)
      end

      context 'when other user is logged in existing device' do
        let(:other_passenger) { create(:passenger) }

        service_context { { user: other_passenger } }

        it 'reassigns UserDevice to the user who sent uuid' do
          expect{ service.execute }.to change{ user_device.reload.user }.to(other_passenger)
        end
      end
    end
  end
end
