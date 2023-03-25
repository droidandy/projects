require 'rails_helper'

RSpec.describe Receipts::ZipBunch, type: :service do
  describe '#execute' do
    subject(:service) { Receipts::ZipBunch.new(passenger: passenger, bookings: [booking1, booking2]) }

    let(:passenger) { create(:passenger, first_name: 'John', last_name: 'Smith') }
    let(:booking1)  { create(:booking, :completed, :personal_card, passenger: passenger) }
    let(:booking2)  { create(:booking, :completed, :business_card, passenger: passenger) }
    let(:direction) { Hashie::Mash.new(direction: 'direction_path') }

    let(:result_path) { Rails.root.join("tmp/user_receipts/#{passenger.id}_rnd/John_Smith.zip") }

    before do
      allow(Zip::File).to receive(:open).and_return(true)
      allow(GoogleApi).to receive(:fetch_direction).and_return(direction)
      allow(SecureRandom).to receive(:hex).and_return('rnd')
      create(:payment, :captured, booking: booking1)
      create(:payment, :captured, booking: booking2)
    end

    it 'returns path of zip' do
      expect(service.execute.result).to eq File.path(result_path)
    end

    context 'no bookings to zip' do
      subject(:service) { Receipts::ZipBunch.new(passenger: passenger, bookings: []) }

      it 'returns nil' do
        expect(service.execute.result).to be_nil
      end
    end
  end
end
