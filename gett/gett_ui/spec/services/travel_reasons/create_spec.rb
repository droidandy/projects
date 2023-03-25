require 'rails_helper'

RSpec.describe TravelReasons::Create, type: :service do
  it { is_expected.to be_authorized_by(TravelReasons::CreatePolicy) }

  describe '#execute' do
    let!(:companyadmin) { create :companyadmin }

    service_context { { member: companyadmin, company: companyadmin.company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) { { name: 'reason', active: true } }

      it 'creates new Travel Reason' do
        expect{ service.execute }.to change(TravelReason, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:travel_reason) { is_expected.to be_persisted }
        its(:travel_reason) { is_expected.to be_active }
        its('travel_reason.name') { is_expected.to eq 'reason' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new Travel Reason' do
        expect{ service.execute }.not_to change(TravelReason, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
