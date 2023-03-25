require 'rails_helper'

RSpec.describe Admin::MemberComments::Create, type: :service do
  describe '#execute' do
    let(:admin)  { create :user, :admin }
    let(:member) { create :member }

    subject(:service) { Admin::MemberComments::Create.new(member: member, params: params) }

    service_context { { admin: admin } }

    context 'with valid params' do
      let(:params) { { text: 'comment' } }

      it 'creates new CompanyComment' do
        expect{ service.execute }.to change(MemberComment, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:comment) { is_expected.to be_persisted }
        its('comment.text') { is_expected.to eq 'comment' }
        its('comment.author_id') { is_expected.to eq admin.id }
        its('comment.kind') { is_expected.to eq 'MemberComment' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { text: '' } }

      it 'does not create new CompanyComment' do
        expect{ service.execute }.not_to change(CompanyComment, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
