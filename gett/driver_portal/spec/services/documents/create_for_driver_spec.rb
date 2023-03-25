require 'rails_helper'
require 'support/shared_examples/service_examples'
include ActionDispatch::TestProcess

RSpec.describe Documents::CreateForDriver do
  describe '#execute!' do
    subject { described_class.new(current_user, admin, params) }
    let(:admin) { create(:user, :with_site_admin_role) }
    let(:current_user) { create(:user, :with_driver_role) }

    let(:kind) { create :documents_kind, owner: :driver }

    let(:params) do
      {
        file: fixture_file_upload('pdf-sample.pdf', 'application/pdf'),
        kind_slug: kind.slug
      }
    end

    include_examples 'it uses policy', DocumentPolicy, :create?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'creates record' do
      expect { subject.execute! }.to change { current_user.documents.count }.by(1)
    end

    it 'assign valid attributes' do
      subject.execute!
      expect(subject.document.kind).to eq(kind)
      expect(subject.document.agent).to eq(admin)
    end

    context 'with vehicle kind owner' do
      let(:kind) { create :documents_kind, owner: :vehicle }

      it 'should fail' do
        subject.execute!
        expect(subject).not_to be_success
      end
    end

    context 'when old documents present' do
      let!(:old_documents) { create_list :document, 2, kind: kind, user: current_user }

      it 'hides old documents' do
        subject.execute!
        expect(subject.document.hidden).to be_falsy
        expect(current_user.documents.where(kind: kind).visible.count).to eq(1)
      end
    end
  end
end
