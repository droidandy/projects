require 'rails_helper'

RSpec.describe Receipts::S3ZipBunch, type: :service do
  describe '#execute' do
    subject(:service) { Receipts::S3ZipBunch.new(passenger: passenger, bookings: [booking1, booking2]) }

    let(:passenger) { create(:passenger, first_name: 'John', last_name: 'Smith') }
    let(:booking1)  { create(:booking, :completed, :personal_card, passenger: passenger) }
    let(:booking2)  { create(:booking, :completed, :business_card, passenger: passenger) }
    let(:direction) { Hashie::Mash.new(direction: 'direction_path') }

    let(:result_path) { "user_receipts/#{passenger.id}_rnd/John_Smith.zip" }

    before do
      allow(GoogleApi).to receive(:fetch_direction).and_return(direction)
      allow(SecureRandom).to receive(:hex).and_return('rnd')
      create(:payment, :captured, booking: booking1)
      create(:payment, :captured, booking: booking2)
    end

    it 'returns path of zip' do
      expect(service.execute.result).to eq result_path
    end

    context 'no bookings to zip' do
      subject(:service) { Receipts::S3ZipBunch.new(passenger: passenger, bookings: []) }

      it 'returns nil' do
        expect(service.execute.result).to be_nil
      end
    end
  end

  describe '#cleanup_old_receipts!' do
    it 'should clear S3 directory' do
      expect(S3TmpFile).to receive(:delete_dir).with(described_class.user_receipts_s3_path)
      described_class.cleanup_old_receipts!
    end
  end
end
