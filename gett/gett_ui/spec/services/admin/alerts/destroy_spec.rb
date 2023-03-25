require 'rails_helper'

RSpec.describe Admin::Alerts::Destroy, type: :service do
  let!(:alert) { create(:alert) }

  subject(:service) { described_class.new(alert_id: alert.id) }

  it 'destroys alert' do
    expect{ service.execute }.to change{ Alert.count }.by(-1)
  end

  context 'has_no_driver_alert' do
    let!(:alert) { create(:alert, :has_no_driver) }

    it 'does not destroy alert' do
      expect{ service.execute }.to change{ Alert.count }.by(0)
    end

    it 'sets resolved to true' do
      expect{ service.execute }.to change{ alert.reload.resolved }.from(false).to(true)
    end
  end

  context 'driver_is_late_alert' do
    let!(:alert) { create(:alert, :driver_is_late) }

    it 'does not destroy alert' do
      expect{ service.execute }.to change{ Alert.count }.by(0)
    end

    it 'sets resolved to true' do
      expect{ service.execute }.to change{ alert.reload.resolved }.from(false).to(true)
    end
  end
end
