require 'rails_helper'

RSpec.describe Admin::Invoices::ExportBunch, type: :service do
  let(:admin) { create :admin }

  describe '#execute' do
    let(:company)   { create(:company) }
    let!(:invoices) { create_list(:invoice, 2, company: company) }

    let(:period_1) { (Time.current - 2.months).strftime("%Y/%m") }
    let(:period_2) { Time.current.strftime("%Y/%m") }

    subject(:service) { Admin::Invoices::ExportBunch.new(periods: [period_1, period_2]) }
    let(:invoice_service_double) { double(execute: double(result: 'some result')) }

    it { is_expected.to be_authorized_by(Admin::Invoices::Policy) }

    in_web do
      service_context { { admin: admin } }

      it 'sends request to background' do
        expect(service).to receive(:send_to_background).with(user: admin, periods: [period_1, period_2])
        service.execute
      end
    end

    in_background do
      let(:background_attrs) { { user: admin, periods: [period_1, period_2] } }

      stub_channelling!

      before do
        allow(File).to receive(:exist?).and_return(false)
        allow(Documents::Invoice).to receive(:new).with(invoice: an_instance_of(Invoice), format: :pdf).and_return(invoice_service_double)
      end

      after do
        # Cleanup files after tests
        service.send(:cleanup_old_files!)
      end

      describe 'execution results' do
        before { service.execute }
        it { is_expected.to be_success }
      end

      describe 'S3 zip-file location' do
        before { service.execute }
        it { expect(described_class.s3_zipfile_content(admin)).to_not be_nil }
      end

      describe 'with credit note' do
        let!(:credit_note) { create(:credit_note, company: company) }
        let(:credit_note_service_double) { double(execute: double(result: 'some result')) }

        before do
          allow(Documents::CreditNote).to receive(:new).with(credit_note: an_instance_of(Invoice), format: :pdf).and_return(credit_note_service_double)
        end

        it 'should call proper service for render pdf' do
          expect(credit_note_service_double).to receive(:execute)
          service.execute
        end
      end

      it 'notifies with progress' do
        channel = "export-invoices-bunch-#{admin.id}"

        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 0), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 50), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 100, download_path: kind_of(String)), success: true)
        service.execute
      end

      it 'notify if error occured' do
        allow(Documents::Invoice).to receive(:new).and_raise(StandardError.new('some error'))
        expect(Faye).to receive(:notify).with("export-invoices-bunch-#{admin.id}", { error: 'some error' }, { success: false })
        service.execute
      end
    end
  end

  describe '.zipfile_path' do
    let(:file_path) { Rails.root.join("tmp/exported_invoices/#{admin.id}/invoices.zip").to_s }

    it 'returns correct file path for user' do
      expect(described_class.zipfile_path(admin)).to eq file_path
    end
  end

  describe '.s3_zipfile_name' do
    let(:s3_file_name) { "exported_invoices/#{admin.id}/invoices.zip" }

    it 'returns correct file path for user' do
      expect(described_class.s3_zipfile_name(admin)).to eq s3_file_name
    end
  end
end
