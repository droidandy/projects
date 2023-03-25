require 'rails_helper'

RSpec.describe Incomings::Splyt::ReceiptHandler do
  subject(:service) { described_class.new(payload: payload) }

  describe '#execute' do
    let(:payload) do
      {
        data: {
          booking_id: booking.service_id
        }
      }
    end

    let(:company)                     { create(:company) }
    let(:booking)                     { create(:booking, company: company, fare_quote: 10) }
    let(:charges_updater)             { double(:charges_updater) }
    let(:receipt_fetcher)             { double(:receipt_fetcher, execute: receipt_fetcher_with_result) }
    let(:receipt_fetcher_with_result) { double(:receipt_fetcher_with_result, normalized_response: normalized_response) }
    let(:normalized_response)         { { amount: 111 } }
    let(:success_charges_updater)     { double(:success_charges_updater, success?: true) }

    before do
      allow(Splyt::Receipt).to receive(:new).with(booking: booking).and_return(receipt_fetcher)
      allow(receipt_fetcher).to receive(:execute).and_return(receipt_fetcher_with_result)

      allow(Bookings::ChargesUpdaters::Splyt).to receive(:new).with(booking: booking).and_return(charges_updater)
      allow(charges_updater).to receive(:execute).and_return(success_charges_updater)
    end

    it 'fetches order cost' do
      expect(Splyt::Receipt).to receive(:new).with(booking: booking).and_return(receipt_fetcher)
      expect(receipt_fetcher).to receive(:execute).and_return(receipt_fetcher_with_result)

      service.execute
    end

    it 'updates booking fare quote' do
      service.execute

      expect(booking.reload.fare_quote).to eq(normalized_response[:amount])
    end

    context 'with fx rate increase' do
      let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }

      before do
        allow(booking).to receive(:international?).and_return(international)
        allow(service).to receive(:booking).and_return(booking)
        service.execute
        booking.reload
      end

      context 'when it applicable for international booking' do
        let(:international) { true }
        let(:new_fare_quote) { (normalized_response[:amount] * 1.5).round }

        it 'change fare_quote for booking according to fx rate increase' do
          expect(booking.reload.fare_quote).to eq(new_fare_quote)
        end
      end

      context 'when it not applicable for local booking' do
        let(:international) { false }
        let(:new_fare_quote) { normalized_response[:amount] }

        it 'leave fare_quote without changes' do
          expect(booking.reload.fare_quote).to eq(new_fare_quote)
        end
      end
    end

    it 'calls charges updater' do
      expect(Bookings::ChargesUpdaters::Splyt).to receive(:new).with(booking: booking).and_return(charges_updater)
      expect(charges_updater).to receive(:execute)

      service.execute
    end

    context 'when booking is cancelled' do
      let(:booking)             { create(:booking, :cancelled, fare_quote: 10) }
      let(:normalized_response) { {amount: 0} }

      it "doesn't update fare_quote" do
        expect{ service.execute }.not_to change{ booking.reload.fare_quote }
      end
    end

    context 'when charges updating is failed' do
      let(:failed_charges_updater) { double(:failed_charges_updater, success?: false) }
      let(:charges_updater)        { double(:charges_updater, errors: 'Test Error') }

      before { allow(charges_updater).to receive(:execute).and_return(failed_charges_updater) }

      it 'sets error and fails result' do
        service.execute

        expect(service.errors).to eq('Test Error')
        expect(service.result).to be false
      end
    end
  end
end
