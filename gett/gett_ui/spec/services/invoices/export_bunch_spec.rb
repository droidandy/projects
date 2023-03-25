require 'rails_helper'

RSpec.describe Invoices::ExportBunch, type: :service do
  let(:company) { create(:company) }
  let(:member)  { create(:companyadmin, company: company) }

  describe '#execute' do
    let!(:invoices) { create_list(:invoice, 2, company: company) }

    let(:period_1) { (Time.current - 2.months).strftime("%Y/%m") }
    let(:period_2) { Time.current.strftime("%Y/%m") }

    subject(:service) { Invoices::ExportBunch.new(periods: [period_1, period_2], company: company) }
    let(:invoice_service_double) { double(execute: double(result: 'some result')) }

    service_context { { member: member } }
    it { is_expected.to be_authorized_by(Invoices::Policy) }

    in_web do
      it 'sends request to background' do
        expect(service).to receive(:send_to_background).with(user: member, periods: [period_1, period_2], company: company)
        service.execute
      end
    end

    in_background do
      let(:background_attrs) { { user: member, periods: [period_1, period_2], company: company } }

      stub_channelling!

      before do
        allow(File).to receive(:exist?).and_return(false)
        allow(Documents::Invoice).to receive(:new).and_return(invoice_service_double)
      end

      after do
        # Cleanup files after tests
        service.send(:cleanup_old_files!)
      end

      describe 'execution results' do
        before { service.execute }
        it { is_expected.to be_success }
      end

      it 'notifies with progress' do
        channel = "export-invoices-bunch-#{member.id}"

        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 0), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 50), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 2, progress: 100, download_path: kind_of(String)), success: true)
        service.execute
      end

      it 'notify if error occured' do
        allow(Documents::Invoice).to receive(:new).and_raise(StandardError.new('some error'))
        expect(Faye).to receive(:notify).with("export-invoices-bunch-#{member.id}", { error: 'some error' }, { success: false })
        service.execute
      end
    end
  end

  describe '.zipfile_path' do
    let(:file_path) { Rails.root.join("tmp/exported_invoices/#{member.id}/invoices.zip").to_s }

    it 'returns correct file path for user' do
      expect(described_class.zipfile_path(member)).to eq file_path
    end
  end
end
