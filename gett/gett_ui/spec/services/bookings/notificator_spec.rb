require 'rails_helper'

RSpec.describe Bookings::Notificator, type: :service do
  let(:booking) { create :booking }
  let(:service) { Bookings::Notificator.new(booking: booking) }

  describe '#execute' do
    describe '#notify_passenger and #notify_faye' do
      before do
        allow(service).to receive(:notify_passenger)
        allow(service).to receive(:notify_faye)

        service.execute{ subject.call }
      end

      context 'when nothing changed' do
        subject { -> {} }

        it 'does no notifications' do
          expect(service).not_to have_received(:notify_passenger)
          expect(service).not_to have_received(:notify_faye)
        end
      end

      context 'when status changed' do
        context "when it's one of statuses for notification" do
          context 'when booking is OT' do
            let(:booking) { create :booking, :creating, :ot }
            subject { -> { booking.update(status: 'order_received') } }

            it 'notifies passenger with sms, email and faye' do
              expect(service).to have_received(:notify_passenger)
              expect(service).to have_received(:notify_faye)
            end
          end

          context 'when booking is Gett' do
            let(:booking) { create :booking, :creating, :gett }
            subject { -> { booking.update(status: 'order_received') } }

            it 'notifies passenger with sms, email and faye' do
              expect(service).to have_received(:notify_passenger)
              expect(service).to have_received(:notify_faye)
            end
          end

          context 'when booking is Manual' do
            let(:booking) { create :booking, :creating, :manual }
            subject { -> { booking.update(status: 'order_received') } }

            it 'notifies only faye' do
              expect(service).not_to have_received(:notify_passenger)
              expect(service).to have_received(:notify_faye)
            end
          end
        end

        context 'when status is not eligible for passenger notification' do
          let(:booking) { create :booking, :ot, :order_received }
          subject { -> { booking.update(status: 'in_progress') } }

          it 'notifies only faye' do
            expect(service).to_not have_received(:notify_passenger)
            expect(service).to have_received(:notify_faye)
          end
        end
      end

      context 'when core values changed' do
        let(:booking) { create :booking, :ot, :order_received, :scheduled, scheduled_at: Time.current.tomorrow }
        subject { -> { booking.update(scheduled_at: Time.current.tomorrow + 1.hour) } }

        it 'notifies passenger and faye' do
          expect(service).to have_received(:notify_passenger)
          expect(service).to have_received(:notify_faye)
        end
      end

      context 'when secondary information changes' do
        let(:booking) { create :booking, :ot, :on_the_way, :with_driver }

        def self.it_notifies_only_faye
          it 'notifies only faye' do
            expect(service).not_to have_received(:notify_passenger)
            expect(service).to have_received(:notify_faye)
          end
        end

        context 'when driver name changes' do
          subject { -> { booking.driver.update(name: 'changed') } }

          it 'notifies passenger and faye' do
            expect(service).to have_received(:notify_passenger)
            expect(service).to have_received(:notify_faye)
          end
        end

        context 'when driver location changes' do
          subject { -> { booking.driver.update(lat: 11.0, lng: 22.0) } }

          it_notifies_only_faye
        end

        context 'when driver bearing changes' do
          subject { -> { booking.driver.update(bearing: 11) } }

          it_notifies_only_faye
        end

        context 'when driver ETA changes' do
          subject { -> { booking.driver.update(eta: 4.44) } }

          it_notifies_only_faye
        end
      end

      context 'when booking without destination_address' do
        before { booking.booking_addresses.last.destroy }

        subject { -> {} }

        it 'does no notifications and does not raise exceptions' do
          expect(service).not_to have_received(:notify_passenger)
          expect(service).not_to have_received(:notify_faye)
        end
      end
    end

    describe 'live and future counter flags' do
      let(:booking) { create :booking, :creating }

      before do
        allow(service).to receive(:notify_passenger)
        allow(Faye.bookings).to receive(:notify_update)

        service.execute{ subject.call }
      end

      context 'when booking was updated from :creating to :order_received' do
        subject { -> { booking.update(status: :order_received) } }

        it 'sends future count modifier' do
          expect(Faye.bookings).to have_received(:notify_update)
            .with(booking, hash_including(live_modifier: 0, future_modifier: 1))
        end
      end

      context 'when booking was updated from :order_received to live status' do
        let(:booking) { create :booking, :order_received, :without_passenger }

        subject { -> { booking.update(status: :locating) } }

        it 'sends live and future count modifiers' do
          expect(Faye.bookings).to have_received(:notify_update)
            .with(booking, hash_including(live_modifier: 1, future_modifier: -1))
        end
      end

      context 'when booking was updated within live status' do
        let(:booking) { create :booking, :locating, :without_passenger }

        subject { -> { booking.update(status: :in_progress) } }

        it 'sends live and future count modifiers' do
          expect(Faye.bookings).to have_received(:notify_update)
            .with(booking, hash_including(live_modifier: 0, future_modifier: 0))
        end
      end

      context 'when booking was updated from live status to completed' do
        let(:booking) { create :booking, :in_progress, :without_passenger }

        subject { -> { booking.update(status: :completed) } }

        it 'sends live and future count modifiers' do
          expect(Faye.bookings).to have_received(:notify_update)
            .with(booking, hash_including(live_modifier: -1, future_modifier: 0))
        end
      end

      context 'when booking was updated from :order_received status to cancelled' do
        let(:booking) { create :booking, :order_received, :without_passenger }

        subject { -> { booking.update(status: :cancelled) } }

        it 'sends live and future count modifiers' do
          expect(Faye.bookings).to have_received(:notify_update)
            .with(booking, hash_including(live_modifier: 0, future_modifier: -1))
        end
      end
    end
  end

  describe '#notify_passenger' do
    it 'delegates to NotifyPassenger service' do
      notify = double('Bookings::NotifyPassenger')
      expect(Bookings::NotifyPassenger).to receive(:new).with(booking: booking)
        .and_return(notify)
      expect(notify).to receive(:execute)

      service.send(:notify_passenger)
    end
  end

  describe '#notify_faye' do
    it 'delegates to Faye.bookings' do
      expect(service).to receive(:indicator_values_changed?).and_return(true)
      expect(service).to receive(:live_modifier).and_return(1)
      expect(service).to receive(:future_modifier).and_return(-1)
      expect(Faye.bookings).to receive(:notify_update)
        .with(booking, indicator: true, live_modifier: 1, future_modifier: -1)

      service.send(:notify_faye)
    end
  end
end
