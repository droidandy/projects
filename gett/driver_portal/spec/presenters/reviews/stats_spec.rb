require 'rails_helper'

RSpec.describe Reviews::Stats do
  subject { described_class.new(user) }

  let(:user) { create(:user, gett_phone: '1234') }

  describe '#as_json' do
    let(:json) do
      {
        gett_phone: '1234',
        compliance_verified: false
      }
    end

    it 'render stats' do
      expect(subject.as_json).to include(json)
    end

    context 'with documents approved' do
      let(:user) { create(:user, approval_status: :approved) }
      let!(:vehicle) { create :vehicle, user: user, approval_status: :approved }

      it 'renders compliance status' do
        expect(subject.as_json[:compliance_verified]).to eq(true)
      end
    end
  end
end
