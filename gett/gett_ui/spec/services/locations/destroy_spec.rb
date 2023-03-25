require 'rails_helper'

RSpec.describe Locations::Destroy, type: :service do
  let!(:location) { create :location }
  let(:service) { described_class.new(location: location) }

  it { is_expected.to be_authorized_by(Locations::Policy) }

  describe '#execute' do
    it 'destroys Location' do
      expect{ service.execute }.to change(Location, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end
end
