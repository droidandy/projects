require 'rails_helper'

RSpec.describe WorkRoles::Create, type: :service do
  it { is_expected.to be_authorized_by(WorkRoles::CreatePolicy) }

  describe '#execute' do
    let!(:companyadmin) { create :companyadmin }
    let(:member) { create :member, company: companyadmin.company }

    service_context { { member: companyadmin, company: companyadmin.company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) { { name: 'role', member_pks: [member.id] } }

      it 'creates new Work Role' do
        expect{ service.execute }.to change(WorkRole, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:work_role) { is_expected.to be_persisted }
        its('work_role.name') { is_expected.to eq 'role' }
        its('work_role.member_pks') { is_expected.to eq [member.id] }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new Work Role' do
        expect{ service.execute }.not_to change(WorkRole, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
