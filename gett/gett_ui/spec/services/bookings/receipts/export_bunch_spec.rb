require 'rails_helper'

RSpec.describe Bookings::Receipts::ExportBunch, type: :service do
  let(:company) { create(:company) }
  let(:booker)  { create(:member, company: company) }

  describe '#execute' do
    let(:period_1) { (2.months.ago).strftime("%Y/%m") }
    let(:period_2) { Time.current.strftime("%Y/%m") }

    let(:receipts_service_double) { double(execute: double(result: 'some result')) }

    subject(:service) { described_class.new(periods: [period_1, period_2]).with_context(member: booker) }

    it { is_expected.to be_authorized_by(Bookings::IndexPolicy) }

    in_web do
      stub_channelling!

      it 'notify if no receipts found' do
        expect(Faye).to receive(:notify).with(
          "export-receipts-bunch-#{booker.id}",
          { error: I18n.t('services.bookings.receipts.no_receipts_found') },
          { success: false }
        )
        service.execute
      end

      context 'when receipts exists' do
        before do
          create(:booking, :completed, :billed, :personal_card, passenger: booker, company: company)
        end

        it 'sends request to background' do
          expect(service).to receive(:send_to_background).with(passenger: booker, periods: [period_1, period_2], member: booker)
          service.execute
        end
      end
    end

    in_background do
      let(:background_attrs) { { passenger: booker, periods: [period_1, period_2], member: booker } }

      stub_channelling!

      before do
        create_list(:booking, 3, :completed, :billed, :personal_card, passenger: booker, company: company)
        allow(File).to receive(:exist?).and_return(false)
        allow(Documents::Receipt).to receive(:new).with(booking_id: an_instance_of(Integer), format: :pdf).and_return(receipts_service_double)
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
        it { expect(described_class.s3_zipfile_content(booker)).to_not be_nil }
      end

      it 'notifies with progress' do
        channel = "export-receipts-bunch-#{booker.id}"

        expect(Faye).to receive(:notify).with(channel, hash_including(total: 3, progress: 0), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 3, progress: 33), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 3, progress: 66), success: true)
        expect(Faye).to receive(:notify).with(channel, hash_including(total: 3, progress: 100, download_path: kind_of(String)), success: true)
        service.execute
      end

      it 'notify if error occured' do
        allow(Documents::Receipt).to receive(:new).and_raise(StandardError.new('some error'))
        expect(Faye).to receive(:notify).with("export-receipts-bunch-#{booker.id}", { error: 'some error' }, { success: false })
        service.execute
      end
    end
  end

  describe '.zipfile_path' do
    let(:file_path) { Rails.root.join("tmp/exported_receipts/#{booker.id}/receipts.zip").to_s }

    it 'returns correct file path for user' do
      expect(described_class.zipfile_path(booker)).to eq file_path
    end
  end

  describe '.s3_zipfile_name' do
    let(:s3_file_name) { "exported_receipts/#{booker.id}/receipts.zip" }

    it 'returns correct file path for user' do
      expect(described_class.s3_zipfile_name(booker)).to eq s3_file_name
    end
  end
end
