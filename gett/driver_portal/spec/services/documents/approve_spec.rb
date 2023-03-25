require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Documents::Approve do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:document) { create :document }

    let(:metadata) do
      {
        meta: :data
      }
    end

    let(:params) do
      {
        document_id: document.id,
        metadata: metadata
      }
    end

    include_examples 'it uses policy', DocumentPolicy, :approve?

    it 'invokes metadata saving' do
      expect(Documents::Metadata::Save).to receive(:new).
        with(
          current_user,
          {
            document: document,
            metadata: metadata
          }
        )
        .and_return(
          instance_double(Documents::Metadata::Save, execute!: true, success?: true, updated_document: document)
        )
      subject.execute!
    end

    context 'when metadata saved successfully' do
      before(:each) do
        stub_service(Documents::Metadata::Save, updated_document: document)
      end

      it 'should invoke status changing service' do
        expect(Documents::ChangeStatus).to receive(:new).
          with(
            current_user,
            {
              document: document,
              status: 'approved'
            }
          )
          .and_return(
            instance_double(Documents::ChangeStatus, execute!: true, success?: true)
          )
        subject.execute!
      end

      it 'set start date' do
        expect { subject.execute! }.to change { document.reload.started_at }
      end

      context 'when start date already filled' do
        let(:document) { create :document, started_at: (Time.current - 1.month) }

        it 'leaves start date unchanged' do
          expect { subject.execute! }.not_to change { document.reload.started_at }
        end
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
    end

    context 'when metadata save failed' do
      before(:each) do
        stub_service(Documents::Metadata::Save, false, updated_document: nil, errors: { a: :b })
      end

      it 'fail' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ a: :b })
      end
    end
  end
end
