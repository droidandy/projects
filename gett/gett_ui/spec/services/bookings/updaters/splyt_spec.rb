require 'rails_helper'

RSpec.describe Bookings::Updaters::Splyt, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  describe '#execute' do
    let(:booking)        { create(:booking, :splyt) }
    let(:driver_updater) { double(:driver_updater) }
    let(:success)        { true }
    let(:booking_params) { { supplier_service_id: '42' } }
    let(:update_fetcher) do
      double(:update_fetcher,
        with_context:        updater_fetcher_with_context,
        success?:            success,
        normalized_response: normalized_response,
        booking_params:      booking_params
      )
    end

    let(:updater_fetcher_with_context) do
      double(:updater_fetcher_with_context, execute: updater_fetcher_with_result)
    end

    let(:updater_fetcher_with_result) do
      double(:updater_fetcher_with_result, normalized_response: normalized_response)
    end

    let(:normalized_response) do
      {
        driver:  {}
      }
    end

    stub_channelling!

    before do
      allow(Splyt::Update).to receive(:new).and_return(update_fetcher)
      allow(update_fetcher).to receive(:with_context).and_return(updater_fetcher_with_context)
      allow(updater_fetcher_with_context).to receive(:execute).and_return(updater_fetcher_with_result)
    end

    it 'executes Splyt::Update service' do
      expect(Splyt::Update).to receive(:new).and_return(update_fetcher)
      expect(update_fetcher).to receive(:with_context).and_return(updater_fetcher_with_context)
      expect(updater_fetcher_with_context).to receive(:execute).and_return(updater_fetcher_with_result)

      service.execute
    end

    context 'when info fetched' do
      it 'updates booking' do
        expect(service).to receive(:update_model).with(booking, booking_params, validate: false).and_return(booking)

        service.execute
      end

      context 'when booking is updated' do
        before { allow(service).to receive(:update_model).with(booking, booking_params, validate: false).and_return(booking) }

        it 'updates driver info' do
          expect(Bookings::DriverUpdater).to receive(:new)
            .with(booking: booking, params: normalized_response[:driver])
            .and_return(driver_updater)
          expect(driver_updater).to receive(:execute)

          service.execute
        end
      end

      context 'when booking is not updated' do
        before { allow(service).to receive(:update_model).with(booking, booking_params, validate: false).and_return(nil) }

        it 'does not update driver info' do
          expect(Bookings::DriverUpdater).not_to receive(:new)

          service.execute
        end
      end
    end

    context 'when booking is stuck' do
      let(:booking) { create(:booking, :splyt, created_at: 3.hours.ago) }
      let(:success) { false }

      it 'updates booking status to processing' do
        expect(service).to receive(:update_model).with(booking, status: :processing)

        service.execute
      end
    end

    context 'when booking is billable' do
      let(:booking) { create(:booking, :splyt, :completed) }

      it 'does not update charges' do
        expect(BookingsChargesUpdater).not_to receive(:perform_async)

        service.execute
      end
    end
  end
end
