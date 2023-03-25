require 'rails_helper'

RSpec.describe Departments::Update, type: :service do
  it { is_expected.to be_authorized_by(Departments::UpdatePolicy) }

  describe '#execute' do
    let(:company)      { create :company }
    let(:companyadmin) { create :companyadmin, company: company }
    let(:department)   { create :department, company: company }
    let!(:member1)     { create :member, department: department, company: company }
    let(:member2)      { create :member, company: company }

    subject(:service) { Departments::Update.new(department: department, params: params) }

    service_context { { member: companyadmin, company: company } }

    context 'with valid params' do
      let(:params) { { name: 'new name', member_pks: [member2.id] } }

      it 'updates Department' do
        expect{ service.execute }.to change{ department.reload.name }.to('new name')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:department) { is_expected.to be_persisted }
        its('department.reload.member_pks') { is_expected.to eq [member2.id] }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not update Department' do
        expect{ service.execute }.not_to change{ department.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
