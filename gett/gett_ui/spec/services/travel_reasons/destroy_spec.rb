require 'rails_helper'

RSpec.describe TravelReasons::Destroy, type: :service do
  let!(:travel_reason) { create(:travel_reason) }
  let(:service)        { described_class.new(travel_reason: travel_reason) }

  it { is_expected.to be_authorized_by(TravelReasons::DestroyPolicy) }

  describe '#execute' do
    it 'destroys Travel Reason' do
      expect{ service.execute }.to change(TravelReason, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end
end
