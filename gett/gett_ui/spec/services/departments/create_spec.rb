require 'rails_helper'

RSpec.describe Departments::Create, type: :service do
  it { is_expected.to be_authorized_by(Departments::CreatePolicy) }

  describe '#execute' do
    let!(:companyadmin) { create :companyadmin }
    let(:member) { create :member, company: companyadmin.company }

    service_context { { member: companyadmin, company: companyadmin.company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) { { name: 'Department', member_pks: [member.id] } }

      it 'creates new Department' do
        expect{ service.execute }.to change(Department, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:department) { is_expected.to be_persisted }
        its('department.name') { is_expected.to eq 'Department' }
        its('department.member_pks') { is_expected.to eq [member.id] }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new Department' do
        expect{ service.execute }.not_to change(Department, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
