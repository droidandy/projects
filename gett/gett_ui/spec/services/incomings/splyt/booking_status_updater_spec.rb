require 'rails_helper'

RSpec.describe Incomings::Splyt::BookingStatusUpdater do
  subject(:service) { described_class.new(payload: payload) }

  let(:booking)        { create(:booking, status: status) }
  let(:status)         { :order_received }
  let(:event_status)   { 'en-route' }
  let(:booking_status) { described_class.const_get(:STATUS_MAPPING)[event_status] }

  let(:payload) do
    {
      data: {
        status:     event_status,
        booking_id: booking_id
      }
    }
  end

  describe '#execute' do
    before { stub_request(:post, 'http://localhost:8000/faye') }

    context 'when payload is valid' do
      let(:booking_id)          { booking.service_id }
      let(:incoming)            { double(:incoming) }
      let(:driver_info_updater) { double(:driver_info_updater, execute: true, success?: update_success) }
      let(:fetch_success)       { true }
      let(:update_success)      { true }
      let(:driver_info_fetcher) do
        double(:driver_info_fetcher, execute: true, success?: fetch_success, normalized_response: normalized_response)
      end
      let(:normalized_response) { { driver: 'driver_info' } }

      before do
        allow(Splyt::DriverInfo).to receive(:new).and_return(driver_info_fetcher)
        allow(Bookings::DriverUpdater).to receive(:new).and_return(driver_info_updater)
      end

      context 'when status is changed' do
        it 'locks a booking' do
          expect_any_instance_of(Booking).to receive(:lock!)

          service.execute
        end

        it 'updates a status' do
          service.execute

          expect(booking.reload.status).to eq(booking_status.to_s)
        end

        context 'when it is notifable' do
          it 'fetches driver info' do
            expect(Splyt::DriverInfo).to receive(:new).and_return(driver_info_fetcher)
            expect(driver_info_fetcher).to receive(:execute)

            service.execute
          end

          context 'when driver info is fetched' do
            it 'updates driver info' do
              expect(Bookings::DriverUpdater).to receive(:new).and_return(driver_info_updater)
              expect(driver_info_updater).to receive(:execute)

              service.execute
            end
          end

          context 'when driver info is not fetched' do
            let(:fetch_success)  { false }
            let(:update_success) { false }

            it 'does not update driver info' do
              expect(Bookings::DriverUpdater).to receive(:new).and_return(driver_info_updater)
              expect(driver_info_updater).to_not receive(:execute)

              service.execute
            end

            it 'sets errors' do
              service.execute

              expect(service.errors).to eq("Cannot update status '#{booking_status}' for booking id: #{booking.id}. Reason: unable to fetch a driver info.")
            end

            it 'does not update a status' do
              service.execute

              expect(booking.reload.status).to_not eq(booking_status.to_s)
            end

            it 'does not notify anybody' do
              expect_any_instance_of(Bookings::Notificator).to_not receive(:notify_passenger)
              expect_any_instance_of(Bookings::Notificator).to_not receive(:notify_faye)

              service.execute
            end
          end
        end

        context 'when it is not notifable' do
          let(:event_status) { 'rejected' }

          it 'does not fetch driver info' do
            expect(Splyt::DriverInfo).to_not receive(:new)

            service.execute
          end

          it 'does not update driver info' do
            expect(Bookings::DriverUpdater).to_not receive(:new)

            service.execute
          end
        end

        it 'notifies a client' do
          expect(service).to receive(:notify_on_update)

          service.execute
        end
      end

      it 'creates an incomig' do
        expect(Incoming).to receive(:new)
          .with(service_type: :splyt, payload: payload, booking: booking)
          .and_return(incoming)
        expect(incoming).to receive(:save)

        service.execute
      end
    end

    context 'when payload is not valid' do
      let(:booking_id) { 'fake id' }
      let(:incoming)   { Incoming.find(service_type: 'splyt') }

      it 'creates incoming with errors' do
        service.execute

        expect(incoming.api_errors).to match('booking' => ['Booking not found'])
        expect(service.errors).to      match(booking: ['Booking not found'])
      end
    end
  end
end
