require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Documents::Reject do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:document) { create :document }
    let(:metadata) { { meta: 'data' } }

    let(:params) do
      {
        document_id: document.id,
        comment: 'Comment',
        metadata: metadata
      }
    end

    include_examples 'it uses policy', DocumentPolicy, :reject?

    it 'should invoke status changing service' do
      expect(Documents::Metadata::Save).to receive(:new).
        with(
          current_user,
          {
            document: document,
            metadata: metadata,
            allow_blank: true
          }
        )
        .and_return(
          instance_double(Documents::Metadata::Save, execute!: true, success?: true, updated_document: true)
        )
      expect(Documents::ChangeStatus).to receive(:new).
        with(
          current_user,
          {
            document: document,
            status: 'rejected',
            comment: 'Comment'
          }
        )
        .and_return(
          instance_double(Documents::ChangeStatus, execute!: true, success?: true)
        )
      subject.execute!
    end

    context 'when status changed successfully' do
      before(:each) do
        stub_service(Documents::ChangeStatus)
      end

      it 'should work' do
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'with no metadata' do
      let(:metadata) { nil }

      it 'should not validate metadata' do
        expect(Documents::Metadata::Save).not_to receive(:new)
        stub_service(Documents::ChangeStatus)
        subject.execute!
        expect(subject).to be_success
      end
    end
  end
end
