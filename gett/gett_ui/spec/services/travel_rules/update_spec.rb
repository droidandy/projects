require 'rails_helper'

RSpec.describe TravelRules::Update, type: :service do
  it { is_expected.to be_authorized_by(TravelRules::UpdatePolicy) }

  describe '#execute' do
    let(:company)       { create :company }
    let(:companyadmin)  { create :companyadmin, company: company }
    let(:travel_rule)   { create :travel_rule, company: company }

    let(:params) do
      {
        priority:    travel_rule.priority,
        name:        new_name,
        location:    travel_rule.location,
        member_pks:  travel_rule.member_pks,
        vehicle_pks: travel_rule.vehicle_pks
      }
    end

    subject(:service) { TravelRules::Update.new(travel_rule: travel_rule, params: params) }

    service_context { { member: companyadmin } }

    context 'with valid params' do
      let(:new_name) { 'New name' }

      it 'updates rule' do
        expect{ service.execute }.to change{ travel_rule.reload.name }.to(new_name)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:new_name) { '' }

      it 'does not update rule' do
        expect{ service.execute }.not_to change{ travel_rule.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
