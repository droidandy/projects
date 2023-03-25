require 'rails_helper'

RSpec.describe WorkRoles::Update, type: :service do
  it { is_expected.to be_authorized_by(WorkRoles::UpdatePolicy) }

  describe '#execute' do
    let(:company)      { create :company }
    let(:companyadmin) { create :companyadmin, company: company }
    let(:work_role1)   { create :work_role, company: company }
    let(:work_role2)   { create :work_role, company: company }
    let!(:member1)     { create :member, company: company, work_role: work_role1 }
    let!(:member2)     { create :member, company: company, work_role: work_role2 }
    let!(:member3)     { create :member, company: company }

    subject(:service) { WorkRoles::Update.new(work_role: work_role2, params: params) }

    service_context { { member: companyadmin, company: company } }

    context 'with valid params' do
      let(:params) { { name: 'new name', member_pks: [member3.id] } }

      it 'updates work role' do
        expect{ service.execute }.to change{ work_role2.reload.name }.to('new name')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }

        it 'updates member work roles according to passed member_pks' do
          expect(work_role2.reload.member_pks).to eq [member3.id]
          expect(member1.reload.work_role_id).to eq work_role1.id
          expect(member2.reload.work_role_id).to be_nil
        end
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not update work role' do
        expect{ service.execute }.not_to change{ work_role1.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
