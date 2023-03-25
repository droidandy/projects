require 'rails_helper'

RSpec.describe DriversApi::Documents::Send do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:document) { create :document }

    let(:params) do
      {
        document: document
      }
    end

    it 'creates new document' do
      stub_service(DriversApi::Documents::Upload)
      expect(DriversApi::Documents::Create).to receive(:new)
        .with(current_user, { document: document })
        .and_return(instance_double(DriversApi::Documents::Create, execute!: true, success?: true, document_id: 111))
      subject.execute!
    end

    context 'when document created' do
      before { stub_service(DriversApi::Documents::Create, document_id: 111) }

      it 'assign external ID to document' do
        stub_service(DriversApi::Documents::Upload)
        subject.execute!
        expect(subject).to be_success
        expect(document.reload.gett_id).to eq(111)
      end

      it 'uploads the document' do
        stub_service(DriversApi::Cars::Assign)
        expect(DriversApi::Documents::Upload).to receive(:new)
          .with(current_user, { document: document })
          .and_return(instance_double(DriversApi::Documents::Upload, execute!: true, success?: true))
        subject.execute!
      end
    end
  end
end
