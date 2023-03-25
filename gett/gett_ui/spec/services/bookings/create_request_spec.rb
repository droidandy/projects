require 'rails_helper'

RSpec.describe Bookings::CreateRequest, type: :service do
  let(:scheduled_at) { 10.minutes.from_now }
  let(:company) { create(:company) }
  let(:booking) { create(:booking, status: :creating, company: company) }
  let(:metadata) { {} }

  subject(:service) { described_class.new(booking: booking, metadata: metadata) }

  describe '#execute' do
    before do
      allow(Faye.bookings).to receive(:notify_update)
    end

    context 'when booking was cancelled before creating' do
      before { booking.update(cancellation_requested_at: Time.current - 1.minute) }

      it 'updates booking status' do
        service.execute

        booking.reload
        expect(booking).to be_cancelled
        expect(booking.cancelled_at).to be_present
      end

      it 'notifies faye' do
        expect(Faye.bookings).to receive(:notify_update)
        service.execute
      end
    end

    context 'api_service' do
      let(:booking) { create(:booking, :ot) }

      it 'calls Bookings.service_for for create' do
        expect(Bookings).to receive(:service_for)
          .with(booking, :create)
          .and_return(double(execute: true))
        service.execute
      end
    end

    context 'when service executed' do
      let(:api_service) { double(:service) }
      let(:callbacks) { double(:callbacks) }
      let(:notify_service) { double }

      before do
        allow(service).to receive(:api_service).and_return(api_service)
        allow(Bookings::NotifyPassenger).to receive(:new).and_return(notify_service)
        allow(notify_service).to receive(:execute)
      end

      context 'when Gett service' do
        let(:gett_response) { { service_id: '7828513267' } }

        before do
          expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
          expect(api_service).to receive(:normalized_response).and_return(gett_response)
          allow(api_service).to receive(:class).and_return(Gett::Create)
          expect(callbacks).to receive(:success){ |&block| block.call }
          allow(callbacks).to receive(:failure)
        end

        it 'sets service_id' do
          service.execute
          expect(service.booking.service_id).to eq '7828513267'
        end

        it 'doesnt call BookingsChargesUpdater' do
          expect(BookingsChargesUpdater).not_to receive(:perform_async)
          service.execute
        end

        context 'when booking was cancelled while creating' do
          before { allow(service).to receive(:booking_cancelled_while_creating?).and_return(true) }

          it 'calls BookingsServiceJob with Bookings::Cancel and does not notify Faye' do
            expect(BookingsServiceJob).to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).not_to receive(:notify_update)
            expect(notify_service).not_to receive(:execute)

            expect{ service.execute }.to change{ booking.reload.status }.from('creating').to('order_received')
          end
        end

        context 'when booking was not cancelled while creating' do
          before { allow(service).to receive(:booking_cancelled_while_creating?).and_return(false) }

          it 'does not call BookingsServiceJob with Bookings::Cancel and notifies Faye' do
            expect(BookingsServiceJob).not_to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).to receive(:notify_update)
            expect(notify_service).to receive(:execute)

            expect{ service.execute }.to change{ booking.reload.status }.from('creating').to('order_received')
          end
        end

        context 'when service failed' do
          before { expect(callbacks).to receive(:failure){ |&block| block.call('response', 'error_message') } }

          it 'raises error and sets customer care message' do
            expect { service.execute }.to raise_error 'Cannot create booking via Gett API'
            expect(booking.reload.customer_care_message).to eq('error_message')
          end
        end

        context 'when BBC company' do
          let(:company) { create(:company, :bbc) }

          context 'metadata contains ride_over_mileage_limit_email' do
            let(:metadata) do
              {
                'ride_over_mileage_limit_email' => {
                  ww_ride: true,
                  excess_mileage: 40,
                  excess_mileage_cost: 4000.0
                }
              }
            end

            it 'sends emails' do
              expect(BbcNotificationsMailer)
                .to receive(:ride_over_mileage_limit_email)
                .with(
                  booking: booking,
                  ww_ride: true,
                  excess_mileage: 40,
                  excess_mileage_cost: 4000.0
                )
                .and_return(double(deliver_later: true))

              service.execute
            end
          end

          context 'metadata contains ride_outside_lnemt_email' do
            let(:metadata) do
              {
                'ride_outside_lnemt_email' => {
                  lnemt_start: '22:00',
                  lnemt_end: '10:00'
                }
              }
            end

            it 'sends emails' do
              expect(BbcNotificationsMailer)
                .to receive(:ride_outside_lnemt_email)
                .with(
                  booking: booking,
                  lnemt_start: '22:00',
                  lnemt_end: '10:00'
                )
                .and_return(double(deliver_later: true))

              service.execute
            end
          end
        end
      end

      context 'when OT service' do
        let(:booking) { create(:booking, :ot, :creating, company: company, quote_id: 'quote1') }
        let(:ot_response) do
          {
            ot_confirmation_number: "1000293548",
            service_id: "AC93573",
            fare_quote: 35374
          }
        end

        before do
          expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
          expect(api_service).to receive(:normalized_response).and_return(ot_response)
          allow(api_service).to receive(:class).and_return(OneTransport::Create)
          expect(callbacks).to receive(:success){ |&block| block.call }
          allow(callbacks).to receive(:failure)
        end

        it 'sets fees, quote_id, confirmation_number and service_id' do
          service.execute
          expect(service.booking.reload).to have_attributes(
            service_id: 'AC93573',
            ot_confirmation_number: '1000293548',
            quote_id: 'quote1',
            fare_quote: 35374
          )
        end

        it 'doesnt call BookingsChargesUpdater' do
          expect(BookingsChargesUpdater).not_to receive(:perform_async)
          service.execute
        end

        context 'with fx rate increase' do
          let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }

          before do
            allow(booking).to receive(:international?).and_return(international)
            service.execute
          end

          context 'when it applicable for international booking' do
            let(:international) { true }

            it 'sets proper fare_quote' do
              expect(service.booking.reload.fare_quote).to eq(53061)
            end
          end

          context 'when it not applicable for local booking' do
            let(:international) { false }

            it 'sets proper fare_quote' do
              expect(service.booking.reload.fare_quote).to eq(35374)
            end
          end
        end

        context 'when booking was cancelled while creating' do
          before { allow(service).to receive(:booking_cancelled_while_creating?).and_return(true) }

          it 'calls BookingsServiceJob with Bookings::Cancel and does not notify Faye' do
            expect(BookingsServiceJob).to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).not_to receive(:notify_update)
            expect(notify_service).not_to receive(:execute)

            expect{ service.execute }.to change{ booking.reload.status }.from('creating').to('order_received')
          end
        end

        context 'when booking was not cancelled while creating' do
          before do
            allow(service).to receive(:booking_cancelled_while_creating?).and_return(false)
          end

          it 'does not call BookingsServiceJob with Bookings::Cancel and notifies Faye' do
            expect(BookingsServiceJob).not_to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).to receive(:notify_update)
            expect(notify_service).to receive(:execute)

            expect{ service.execute }.to change{ booking.reload.status }.from('creating').to('order_received')
          end
        end

        context 'when service failed' do
          before { expect(callbacks).to receive(:failure){ |&block| block.call('response', 'error_message') } }

          it 'raises error and sets customer care message' do
            expect{ service.execute }.to raise_error 'Cannot create booking via OneTransport API'
            expect(booking.reload.customer_care_message).to eq('error_message')
          end
        end
      end

      context 'when Manual service' do
        let(:booking) { create(:booking, :manual) }
        let(:manual_response) do
          {
            service_id: '123'
          }
        end

        before do
          expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
          expect(api_service).to receive(:normalized_response).and_return(manual_response)
          allow(api_service).to receive(:class).and_return(Manual::Create)
          expect(callbacks).to receive(:success){ |&block| block.call }
          allow(callbacks).to receive(:failure)
        end

        it 'calls BookingsChargesUpdater' do
          expect(BookingsChargesUpdater).to receive(:perform_async)
          service.execute
        end

        it 'sets service_id' do
          service.execute
          expect(service.booking.service_id).to eq '123'
        end
      end

      context 'when Carey service' do
        let(:booking) { create(:booking, :carey, :creating) }
        let(:carey_response) { { service_id: "WA10701621-1" } }

        before do
          expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
          expect(api_service).to receive(:normalized_response).and_return(carey_response).at_least(:once)
          allow(api_service).to receive(:class).and_return(Carey::Create)
          expect(callbacks).to receive(:success){ |&block| block.call }
          allow(callbacks).to receive(:failure)
        end
      end

      context 'when Carey service' do
        let(:booking) { create(:booking, :carey, :creating) }
        let(:carey_response) { { service_id: "WA10701621-1" } }

        before do
          expect(api_service).to receive(:execute){ |&block| block.call(callbacks) }
          expect(api_service).to receive(:normalized_response).and_return(carey_response).at_least(:once)
          allow(api_service).to receive(:class).and_return(Carey::Create)
          expect(callbacks).to receive(:success){ |&block| block.call }
          allow(callbacks).to receive(:failure)
        end

        it 'sets service_id' do
          service.execute
          expect(service.booking.service_id).to eq 'WA10701621-1'
        end

        context 'when booking was cancelled while creating' do
          before do
            allow(service).to receive(:booking_cancelled_while_creating?).and_return(true)
          end

          it 'calls BookingsServiceJob with Bookings::Cancel and does not notify Faye' do
            expect(BookingsServiceJob).to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).not_to receive(:notify_update)
            expect(notify_service).not_to receive(:execute)

            service.execute
          end
        end

        context 'when booking was not cancelled while creating' do
          before { allow(service).to receive(:booking_cancelled_while_creating?).and_return(false) }

          it 'does not call BookingsServiceJob with Bookings::Cancel and notifies Faye' do
            expect(BookingsServiceJob).not_to receive(:perform_later).with(booking, 'Bookings::Cancel')
            expect(Faye.bookings).to receive(:notify_update)
            expect(notify_service).to receive(:execute)

            service.execute
          end
        end

        context 'when service failed' do
          before { expect(callbacks).to receive(:failure){ |&block| block.call } }

          it 'raises error' do
            expect{ service.execute }.to raise_error 'Cannot create booking via Carey API'
          end
        end
      end
    end
  end
end
