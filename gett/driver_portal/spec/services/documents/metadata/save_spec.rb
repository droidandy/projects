require 'rails_helper'
require 'support/shared_examples/service_examples'
require 'document_definitions/base'

RSpec.describe Documents::Metadata::Save do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:document) { create :document }

    let(:metadata) do
      {
        string_field: 'My string',
        date_field: '2018-03-08',
        bool_field: false
      }
    end

    let(:params) do
      {
        document: document,
        metadata: metadata
      }
    end

    let(:parsed_metadata) do
      { a: 1, b: '2', c: true }
    end

    it 'sends metadata for validation' do
      expect(Documents::Metadata::Validate).to receive(:new).
        with(
          current_user,
          {
            kind: document.kind,
            metadata: metadata,
            allow_blank: nil
          }
        )
        .and_return(
          instance_double(Documents::Metadata::Validate, execute!: true, success?: true, output: parsed_metadata)
        )
      subject.execute!
    end

    context 'with valid metadata' do
      before(:each) do
        stub_service(Documents::Metadata::Validate, output: parsed_metadata)
      end

      it 'updates document metadata' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.updated_document.metadata).to eq(parsed_metadata.stringify_keys)
      end

      context 'when document kind has definition class' do
        let(:kind) { create :documents_kind, definition_class: 'Base' }
        let(:document) { create :document, kind: kind }

        it 'should invoke metadata application' do
          expect_any_instance_of(DocumentDefinitions::Base).to receive(:apply_metadata_changes!).and_return(true)
          subject.execute!
          expect(subject).to be_success
        end
      end
    end

    context 'with invalid metadata' do
      before(:each) do
        stub_service(Documents::Metadata::Validate, false, output: nil, errors: { a: :b })
      end

      it 'fail' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ a: :b })
      end
    end
  end
end
