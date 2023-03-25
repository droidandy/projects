require 'rails_helper'

RSpec.describe Admin::BookingReferences::Update, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(booking_reference: booking_reference, params: params) }

    let(:booking_reference) { create(:booking_reference) }
    let(:attachment) { nil }

    context 'with valid params' do
      let(:params) { booking_reference.values.except(:id).merge(name: 'changed', attachment: attachment) }

      it 'updates booking_reference' do
        expect{ service.execute }.to change{ booking_reference.reload.name }.to('changed')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { are_expected.to be_blank }
      end

      context 'with attachment' do
        let(:attachment) { Rack::Test::UploadedFile.new(File.open(file)) }
        let(:file) { File.join(Rails.root, 'spec/fixtures/references.csv') }

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

      context 'removing an already-existing attachment' do
        let(:existing_attachment) { Rack::Test::UploadedFile.new(File.open(file)) }
        let(:file)                { File.join(Rails.root, 'spec/fixtures/references.csv') }
        let(:booking_reference)   { create(:booking_reference, attachment: existing_attachment) }
        let(:attachment)          { 'null' }

        subject { service.execute.result }

        its([:attachment]) { is_expected.to be_nil }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not update booking_reference' do
        expect{ service.execute }.not_to change{ booking_reference.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'with sftp server option' do
      let(:params) do
        booking_reference.values.except(:id).merge(sftp_server: 'true')
      end

      context 'sftp was not enabled' do
        before do
          enable_sftp_service = double('Admin::Companies::EnableSftp')
          expect(Admin::Companies::EnableSftp).to receive(:new).and_return(enable_sftp_service)
          expect(enable_sftp_service).to receive(:execute).and_return(enable_sftp_service)

          create(:reference_entry, booking_reference: booking_reference)
        end

        it 'executes successfully' do
          expect(service.execute).to be_success
        end

        it 'clears reference entries' do
          expect{ service.execute }.to change(ReferenceEntry, :count).by(-1)
        end
      end

      context 'sftp was already enabled' do
        let(:booking_reference) { create(:booking_reference, sftp_server: true) }

        it 'executes successfully' do
          expect(service.execute).to be_success
        end

        it 'does not clear reference entries' do
          expect{ service.execute }.to_not change(ReferenceEntry, :count)
        end
      end
    end

    context 'disabling sftp option' do
      let(:booking_reference) { create(:booking_reference, sftp_server: true) }

      let(:params) do
        booking_reference.values.except(:id).merge(sftp_server: 'false')
      end

      before { create(:reference_entry, booking_reference: booking_reference) }

      it 'executes successfully' do
        expect(service.execute).to be_success
      end

      it 'clears reference entries' do
        expect{ service.execute }.to change(ReferenceEntry, :count).by(-1)
      end
    end
  end
end
