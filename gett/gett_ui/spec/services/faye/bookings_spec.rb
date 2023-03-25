require 'rails_helper'

RSpec.describe Faye::Bookings do
  let(:booking)    { create :booking }
  let(:company_id) { booking.company.id }
  let(:service)    { Faye::Bookings.new }

  describe '#notify_create' do
    let(:booking_opts) { { status: booking.status, service_id: booking.service_id, order_id: booking.service_id } }

    it 'calls Faye.notify with proper arguments' do
      expect(Faye).to receive(:notify).with('bookings', action: 'created', booking_id: booking.id)
      expect(Faye).to receive(:notify).with("bookings-#{company_id}", action: 'created', booking_id: booking.id)
      expect(Faye).to receive(:notify).with(booking, action: 'created', **booking_opts)

      service.notify_create(booking)
    end
  end

  describe '#notify_update' do
    let(:booking_opts) { { status: booking.status, service_id: booking.service_id, order_id: booking.service_id } }

    it 'calls Faye.notify with proper arguments' do
      expect(Faye).to receive(:notify)
        .with('bookings', action: 'updated', booking_id: booking.id, foo: 'bar')
      expect(Faye).to receive(:notify)
        .with("bookings-#{company_id}", action: 'updated', booking_id: booking.id, foo: 'bar')
      expect(Faye).to receive(:notify)
        .with(booking, action: 'updated', foo: 'bar', **booking_opts)

      service.notify_update(booking, foo: 'bar')
    end

    context 'booking has driver' do
      let(:path_points) { [[1, 2, 3, true], [5, 6, 7, false], [9, 10, 11, false]] }
      let!(:driver) do
        create(:booking_driver, booking: booking, lat: 123, lng: 456, bearing: 10, path_points: path_points)
      end

      before do
        expect(Faye).to receive(:notify)
          .with('bookings', action: 'updated', booking_id: booking.id, foo: 'bar')
        expect(Faye).to receive(:notify)
          .with("bookings-#{company_id}", action: 'updated', booking_id: booking.id, foo: 'bar')
        expect(Faye).to receive(:notify)
          .with(booking, action: 'updated', foo: 'bar', **booking_opts)
      end

      context 'status is in_progress' do
        let(:booking_opts) do
          {
            status: 'in_progress',
            service_id: booking.service_id,
            order_id: booking.service_id,
            driver: { lat: 123, lng: 456, bearing: 10 },
            driver_path: [{ lat: 5, lng: 6, bearing: 7 }, { lat: 9, lng: 10, bearing: 11 }]
          }
        end

        before { booking.update(status: 'in_progress') }

        it 'calls Faye.notify with proper arguments' do
          service.notify_update(booking, foo: 'bar')
        end
      end

      context 'status is on_the_way' do
        let(:booking_opts) do
          {
            status: 'on_the_way',
            service_id: booking.service_id,
            order_id: booking.service_id,
            driver: { lat: 123, lng: 456, bearing: 10 },
            driver_path: [{ lat: 1, lng: 2, bearing: 3 }]
          }
        end

        before { booking.update(status: 'on_the_way') }

        it 'calls Faye.notify with proper arguments' do
          service.notify_update(booking, foo: 'bar')
        end
      end
    end
  end
end
