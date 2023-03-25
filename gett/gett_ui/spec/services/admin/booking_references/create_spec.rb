require 'rails_helper'

RSpec.describe Admin::BookingReferences::Create, type: :service do
  describe '#execute' do
    let(:company) { create(:company) }
    let(:attachment) { nil }

    subject(:service) { Admin::BookingReferences::Create.new(company: company, params: params) }

    context 'with valid params' do
      let(:params) { { name: 'reference_1', attachment: attachment, priority: '1' } }

      it 'creates new BookingReference' do
        expect{ service.execute }.to change(BookingReference, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:booking_reference) { is_expected.to be_persisted }
        its(:errors) { is_expected.to be_blank }
      end

      context 'with attachment' do
        let(:file) { File.join(Rails.root, '/spec/fixtures/references.csv') }
        let(:attachment) { Rack::Test::UploadedFile.new(File.open(file)) }

        subject { service.execute.result }

        its([:attachment]) { is_expected.to eq('references.csv') }

        it 'creates reference entries' do
          expect{ service.execute }.to change(ReferenceEntry, :count).by(4)
        end
      end

      context 'without attachment' do
        subject { service.execute.result }

        its([:attachment]) { is_expected.to be_nil }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '', priority: '1', active: true } }

      it 'does not create new BookingReference' do
        expect{ service.execute }.not_to change(BookingReference, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'with sftp server option' do
      let(:params) { { name: 'reference_1', attachment: attachment, priority: '1', sftp_server: 'true' } }

      before do
        enable_sftp_service = double('Admin::Companies::EnableSftp')
        expect(Admin::Companies::EnableSftp).to receive(:new).and_return(enable_sftp_service)
        expect(enable_sftp_service).to receive(:execute).and_return(enable_sftp_service)
      end

      it 'executes successfully' do
        expect(service.execute).to be_success
      end

      it 'does not create reference entries' do
        expect{ service.execute }.to_not change(ReferenceEntry, :count)
      end
    end
  end
end
