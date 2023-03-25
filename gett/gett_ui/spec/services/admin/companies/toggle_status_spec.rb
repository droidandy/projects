require 'rails_helper'

RSpec.describe Admin::Companies::ToggleStatus, type: :service do
  it { is_expected.to be_authorized_by(Admin::Companies::ToggleStatusPolicy) }

  let(:active) { true }
  let(:company) { create :company, active: active }

  subject(:service) { described_class.new(company: company) }

  describe '#execute' do
    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    context 'when company is active' do
      it 'deactivates company' do
        expect{ service.execute }.to change(company, :active).to(false)
      end
    end

    context 'when company is inactive' do
      let(:active) { false }

      it 'activates company' do
        expect{ service.execute }.to change(company, :active).to(true)
      end
    end
  end
end
