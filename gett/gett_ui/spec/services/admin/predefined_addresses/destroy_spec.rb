require 'rails_helper'

RSpec.describe Admin::PredefinedAddresses::Destroy, type: :service do
  let!(:predefined_address) { create(:predefined_address) }
  let(:service) { described_class.new(predefined_address: predefined_address) }

  describe '#execute' do
    it 'destroys PredefinedAddress' do
      expect{ service.execute }.to change(PredefinedAddress, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end
end
