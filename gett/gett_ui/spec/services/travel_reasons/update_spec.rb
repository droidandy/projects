require 'rails_helper'

RSpec.describe TravelReasons::Update, type: :service do
  it { is_expected.to be_authorized_by(TravelReasons::UpdatePolicy) }

  describe '#execute' do
    let(:company)       { create :company }
    let(:companyadmin)  { create :companyadmin, company: company }
    let(:travel_reason) { create :travel_reason, company: company }

    subject(:service) { TravelReasons::Update.new(travel_reason: travel_reason, params: params) }

    service_context { { member: companyadmin } }

    context 'with valid params' do
      let(:params) { { name: 'new name' } }

      it 'updates Reason For Travel' do
        expect{ service.execute }.to change{ travel_reason.reload.name }.to('new name')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not update Reason For Travel' do
        expect{ service.execute }.not_to change{ travel_reason.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
