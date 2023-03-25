require 'rails_helper'

RSpec.describe Admin::Members::ActivateAll, type: :service do
  it { is_expected.to be_authorized_by(Admin::Members::ActivateAllPolicy) }

  let(:company) { create(:company) }
  let(:member)  { create(:member, company: company, active: false) }

  subject(:service) { described_class.new(company: company) }

  describe '#execute' do
    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    it 'activated all members' do
      expect{ service.execute }.to change{ member.reload.active }.to(true)
    end
  end
end
