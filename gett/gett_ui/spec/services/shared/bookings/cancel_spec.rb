require 'rails_helper'

RSpec.describe Shared::Bookings::Cancel, type: :service do
  let(:booker)  { create(:booker) }
  let(:booking) { create(:booking, status: 'order_received') }
  let(:cancellation_fee) { true }

  stub_channelling!

  subject(:service) do
    Shared::Bookings::Cancel.new(
      booking: booking,
      params: {cancellation_fee: cancellation_fee},
      cancelled_by: booker,
      cancelled_through_back_office: false
    )
  end

  describe '#execute' do
    let(:api_service) { double(:service) }
    let(:callbacks)   { double(:callbacks) }

    before do
      allow(service).to receive(:api_service).and_return(api_service)
      allow(Faye.bookings).to receive(:notify_update)
    end

    context 'when booking is not cancellable' do
      let(:booking) { create(:booking, status: 'in_progress') }

      it 'returns false' do
        service.execute
        expect(service.result).to be false
      end
    end

    context 'when booking is not requested yet' do
      let(:booking) { create(:booking, status: 'creating', service_id: nil) }

      it 'returns true and sets cancellation_requested_at and cancelled_by' do
        expect{ service.execute }.to change{ booking.cancellation_requested_at }.from(nil)
        expect(service.result).to be true
        expect(booking.cancelled_by).to eq(booker)
        expect(booking.cancelled_through_back_office).to be false
      end

      context 'when cancelled by reincarnated admin' do
        let(:admin) { create(:user, :admin) }

        subject(:service) do
          Shared::Bookings::Cancel.new(
            booking: booking,
            params: {cancellation_fee: cancellation_fee},
            cancelled_by: admin,
            cancelled_through_back_office: true
          )
        end

        it 'returns true and sets cancellation_requested_at and cancelled_by' do
          expect{ service.execute }.to change{ booking.cancellation_requested_at }.from(nil)
          expect(service.result).to be true
          expect(booking.cancelled_by).to eq(admin)
          expect(booking.status_before_cancellation).to eq('creating')
          expect(booking.cancelled_through_back_office).to be true
        end
      end
    end

    context 'when booking is splyt and has customer_care status' do
      let(:booking) { create(:booking, :splyt, status: 'customer_care') }

      it 'does not call Cancel service' do
        expect(Bookings).to_not receive(:service_for)

        service.execute
      end

      it 'updates booking status to cancelled' do
        service.execute

        expect(booking.status).to eq('cancelled')
      end
    end

    context 'when api service executes' do
      before do
        expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
        expect(callbacks).to receive(:success){ |&block| block.call }
        allow(callbacks).to receive(:failure)
        allow(api_service).to receive(:error_message).and_return('error message')
      end

      it 'updates booking status and sets cancelled_at and cancelled_by' do
        expect{ service.execute }.to change{ booking.status }
          .from('order_received').to('cancelled')
          .and change{ booking.cancelled_at }.from(nil)
        expect(booking.cancelled_by.reload).to eq(booker)
        expect(booking.status_before_cancellation).to eq('order_received')
        expect(booking.cancelled_through_back_office).to be false
      end

      context 'when cancelled by reincarnated admin' do
        let(:admin) { create(:user, :admin) }

        subject(:service) do
          Shared::Bookings::Cancel.new(
            booking: booking,
            params: {cancellation_fee: cancellation_fee},
            cancelled_by: admin,
            cancelled_through_back_office: true
          )
        end

        it 'updates booking status and sets cancelled_at and cancelled_by' do
          expect{ service.execute }.to change{ booking.status }
            .from('order_received').to('cancelled')
            .and change{ booking.cancelled_at }.from(nil)
          expect(booking.cancelled_by.reload).to eq(admin)
          expect(booking.status_before_cancellation).to eq('order_received')
          expect(booking.cancelled_through_back_office).to be true
        end
      end

      it 'notifies Faye' do
        expect(Faye.bookings).to receive(:notify_update)
        service.execute
      end

      it 'enqueues a charges updater' do
        expect(BookingsChargesUpdater).to receive(:perform_async).with(booking.id)
        service.execute
      end

      context 'when cancelling without fee' do
        let(:cancellation_fee) { false }

        it 'sets booking cancellation fee to false' do
          service.execute
          expect(booking.cancellation_fee).to be false
        end
      end

      context 'when api service failed' do
        before { expect(callbacks).to receive(:failure){ |&block| block.call } }

        it 'fails with an error' do
          expect{ service.execute }.to raise_error(::Bookings::ServiceProviderError)
        end
      end
    end

    context 'when booking is recurring' do
      let(:booking) { create(:booking, :recurring, booker: booker) }
      let(:service) do
        Shared::Bookings::Cancel.new(
          booking: booking,
          params: params,
          cancelled_by: booker,
          cancelled_through_back_office: false
        )
      end

      before do
        expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
        expect(callbacks).to receive(:success){ |&block| block.call }
        allow(callbacks).to receive(:failure)
      end

      context 'when cancelling only current booking' do
        let(:params) { {} }

        it 'cancels booking and spawns next recurring order' do
          expect(booking.db).to receive(:after_commit)
          expect{ service.execute }.to change{ booking.status }.from('order_received').to('cancelled')
        end
      end

      context 'when cancelling booking with schedule' do
        let(:params) { {cancel_schedule: true} }

        it 'cancels booking and does not spawn next recurring order' do
          expect(SpawnRecurringBooking).not_to receive(:perform_async)
          expect{ service.execute }.to change{ booking.status }.from('order_received').to('cancelled')
        end
      end
    end

    context 'when cancellation reason id is present in params' do
      let(:cancellation_reason) { 'mistaken_order' }

      subject(:service) do
        Shared::Bookings::Cancel.new(
          booking: booking,
          params: { cancellation_reason: cancellation_reason },
          cancelled_by: booker,
          cancelled_through_back_office: false
        )
      end

      before do
        expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
        expect(callbacks).to receive(:success){ |&block| block.call }
        allow(callbacks).to receive(:failure)
      end

      it 'notifies Faye' do
        expect(Faye).to receive(:notify)
        service.execute
      end

      it { expect{ service.execute }.to change{ booking.cancellation_reason }.to(cancellation_reason) }
    end
  end

  describe '#api_service' do
    let(:booking) { create(:booking, :ot) }

    it 'calls Bookings.service_for for cancel' do
      expect(Bookings).to receive(:service_for)
        .with(booking, :cancel)
        .and_return(double(execute: true))
      service.execute
    end
  end
end
