require 'rails_helper'

RSpec.describe Bookings::PushNotification, type: :service do
  let(:message) do
    {
      data: {
        kind: message_kind,
        booking_id: booking.id
      },
      notification: {
        body: notification,
        sound: 'default'
      }
    }
  end

  let(:passenger)        { create(:passenger) }
  let(:device)           { create(:user_device, user: passenger) }
  let!(:inactive_device) { create(:user_device, :inactive, user: passenger) }
  let(:tokens)           { [device.token] }

  context 'when notification is of BOOKING_STATUS_CHANGE kind' do
    subject(:service) { described_class.new(booking: booking, kind: Bookings::PushNotification::BOOKING_STATUS_CHANGE) }

    let(:message_kind) { 'booking_status_change' }
    let(:booking)      { create(:booking, status, passenger: passenger) }
    let(:notification) { I18n.t("booking.push_notifications.#{status}", order_id: booking.order_id) }

    %i[order_received on_the_way arrived cancelled rejected].each do |status|
      context "when booking status is #{status}" do
        let(:status) { status }

        specify do
          expect(PushSender).to receive(:perform_async).with(tokens, message, nil)
          expect(service.execute).to be_success
          expect(notification).not_to match(/translation missing/)
        end
      end
    end

    context 'service is instantiated with back up with sms attribute' do
      let(:status) { :order_received }

      subject(:service) { described_class.new(booking: booking, kind: Bookings::PushNotification::BOOKING_STATUS_CHANGE, back_up_with_sms: true) }

      specify do
        expect(PushSender).to receive(:perform_async).with(tokens, message, true)
        expect(service.execute).to be_success
      end
    end
  end

  context 'when notification is of FLIGHT_STATUS_CHANGE kind' do
    subject(:service) do
      described_class.new(
        booking:       booking,
        kind:          Bookings::PushNotification::FLIGHT_STATUS_CHANGE,
        flight_status: flight_status
      )
    end

    let(:message_kind) { 'flight_status_change' }
    let(:notification) { I18n.t("booking.push_notifications.#{flight_status}") }
    let(:booking)      { create(:booking, :scheduled, :with_flight, passenger: passenger) }

    %i[flight_cancelled flight_delayed flight_diverted flight_redirected].each do |flight_status|
      context "when flight status is #{flight_status}" do
        let(:flight_status) { flight_status }

        specify do
          expect(PushSender).to receive(:perform_async).with(tokens, message, nil)
          expect(service.execute).to be_success
          expect(notification).not_to match(/translation missing/)
        end
      end
    end

    context 'when booking has no passenger' do
      let(:booking) { create(:booking, :scheduled, :with_flight, :without_passenger) }

      %i[flight_cancelled flight_delayed flight_diverted flight_redirected].each do |flight_status|
        context "when flight status is #{flight_status}" do
          let(:flight_status) { flight_status }

          specify do
            expect(PushSender).not_to receive(:perform_async).with(tokens, message, nil)
            expect(service.execute).not_to be_success
          end
        end
      end
    end
  end
end
