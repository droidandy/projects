require 'rails_helper'

RSpec.describe Admin::Companies::Disable, type: :service do
  it { is_expected.to be_authorized_by(Admin::Companies::ToggleStatusPolicy) }

  let(:company) { create(:company) }

  subject(:service) { described_class.new(company: company) }

  describe '#execute' do
    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    it 'disables company' do
      expect{ service.execute }.to change(company, :active).to(false)
    end
  end
end
