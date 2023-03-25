require 'rails_helper'

RSpec.describe TravelRules::Destroy, type: :service do
  let!(:travel_rule) { create(:travel_rule) }
  let(:service)      { described_class.new(travel_rule: travel_rule) }

  it { is_expected.to be_authorized_by(TravelRules::DestroyPolicy) }

  describe '#execute' do
    it 'destroys Travel Reason' do
      expect{ service.execute }.to change(TravelRule, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end
end
