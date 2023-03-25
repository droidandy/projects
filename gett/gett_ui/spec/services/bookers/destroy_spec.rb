require 'rails_helper'

RSpec.describe Bookers::Destroy, type: :service do
  let!(:booker) { create(:booker) }
  let(:service) { described_class.new(booker: booker) }

  it { is_expected.to be_authorized_by(Bookers::DestroyPolicy) }

  describe '#execute' do
    it 'destroys Booker' do
      expect{ service.execute }.to change(Member, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end
end
