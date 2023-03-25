require 'rails_helper'

RSpec.describe Bookings::Cancel, type: :service do
  it { is_expected.to be_authorized_by(Bookings::CancelPolicy) }

  service_context { { member: booker } }

  let(:booker)  { create(:booker) }
  let(:booking) { create(:booking, status: 'order_received') }
  let(:params)  { {} }

  subject(:service) do
    Bookings::Cancel.new(booking: booking, params: params)
  end

  describe '#execute' do
    before do
      allow(Faye.bookings).to receive(:notify_update)
    end

    it 'delegates to Shared::Bookings::Cancel' do
      expect(Shared::Bookings::Cancel).to receive(:new)
        .with(
          booking: booking,
          params: params,
          cancelled_by: booker,
          cancelled_through_back_office: false
        )
        .and_return(double(execute: double(success?: true), result: true))

      expect(service.execute).to be_success
    end

    context 'when internal service fails' do
      it 'sets errors correspondingly' do
        expect(Shared::Bookings::Cancel).to receive(:new)
          .and_return(double(execute: double(success?: false), result: false, errors: {api: 'error'}))

        expect(service.execute).not_to be_success
        expect(service.errors).to eq(api: 'error')
      end
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

        service_context { { member: booker, reincarnated: true, original_user: admin } }

        it 'returns true and sets cancellation_requested_at and cancelled_by' do
          expect{ service.execute }.to change{ booking.cancellation_requested_at }.from(nil)
          expect(service.result).to be true
          expect(booking.cancelled_by).to eq(admin)
          expect(booking.status_before_cancellation).to eq('creating')
          expect(booking.cancelled_through_back_office).to be true
        end
      end
    end

    context 'when executed by incarnated admin' do
      let(:admin) { create(:admin) }

      service_context { { member: booker, reincarnated: true, original_user: admin } }

      it 'delegates to Shared::Bookings::Cancel with proper attributes' do
        expect(Shared::Bookings::Cancel).to receive(:new)
          .with(
            booking: booking,
            params: params,
            cancelled_by: admin,
            cancelled_through_back_office: true
          )
          .and_return(double(execute: double(success?: true), result: true))

        expect(service.execute).to be_success
      end
    end
  end

  describe '#booking_data' do
    it 'delegates to Bookings::Show' do
      show_service = double('Bookings::Show')
      expect(Bookings::Show).to receive(:new).with(booking: booking).and_return(show_service)
      expect(show_service).to receive_message_chain(:execute, :result).and_return(:booking_data)

      expect(service.booking_data).to eq :booking_data
    end
  end
end
