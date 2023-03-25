require 'rails_helper'

RSpec.describe Alerts::BookingsChecker, type: :service do
  let(:booking) { create(:booking, :without_passenger, :on_the_way) }
  subject(:service) { described_class.new(booking: booking) }

  let(:create_alert_service) { double('Alerts::Create') }
  let(:remove_alert_service) { double('Alerts::Remove').as_null_object }

  before do
    allow(Alerts::Remove).to receive(:new).and_return(remove_alert_service)
  end

  describe '#execute!' do
    context 'with driver' do
      context 'driver is late' do
        let(:booking) { create(:booking, :without_passenger, :on_the_way, scheduled_at: 6.minutes.ago) }
        let!(:driver) { create(:booking_driver, booking: booking) }

        it 'creates alert' do
          expect(Alerts::Create).to receive(:new)
            .with(booking: booking, type: :driver_is_late)
            .and_return(create_alert_service)
          expect(create_alert_service).to receive(:execute)

          service.execute
        end
      end
    end

    context 'no driver' do
      context 'asap booking' do
        let(:booking) { create(:booking, :without_passenger) }

        it 'create alert if no driver in 5 minutes after creating' do
          booking.update(created_at: Time.current - 6.minutes)

          expect(Alerts::Create).to receive(:new)
            .with(booking: booking, type: :has_no_driver)
            .and_return(create_alert_service)
          expect(create_alert_service).to receive(:execute)

          service.execute
        end

        it 'removes alert if driver present in 5 minutes after creating' do
          create(:booking_driver, booking: booking)
          booking.update(created_at: Time.current - 6.minutes)

          stub_remove_alert_service(:has_no_driver)

          expect(remove_alert_service).to receive(:execute)
          service.execute
        end
      end

      context 'future booking' do
        let(:booking) { create(:booking, :without_passenger, :scheduled) }

        it 'create alert if no driver in less then 30 minutes before scheduled' do
          booking.update(scheduled_at: 25.minutes.from_now)

          expect(Alerts::Create).to receive(:new)
            .with(booking: booking, type: :has_no_driver)
            .and_return(create_alert_service)
          expect(create_alert_service).to receive(:execute)

          service.execute
        end

        it 'removes alert if driver present in less then 30 minutes before scheduled' do
          create(:booking_driver, booking: booking, vehicle: {data: :some_data})
          booking.update(scheduled_at: 25.minutes.from_now)

          stub_remove_alert_service(:has_no_driver)

          expect(remove_alert_service).to receive(:execute)
          service.execute
        end
      end

      context 'no driver alert already exists' do
        before { booking.add_alert(type: 'has_no_driver', level: 'critical') }

        it 'does not create alert' do
          expect(Alerts::Create).not_to receive(:new)
          expect(create_alert_service).not_to receive(:execute)

          service.execute
        end
      end

      context 'manual vehicle booking' do
        let(:booking) { create(:booking, :manual, :without_passenger) }

        it 'doesnt create alert if no driver in 5 minutes after creating for asap bookings' do
          booking.update(created_at: Time.current - 6.minutes)

          expect(Alerts::Create).not_to receive(:new)
          expect(create_alert_service).not_to receive(:execute)

          service.execute
        end

        it 'doesnt create alert if no driver in less then 30 minutes before scheduled for future bookings' do
          booking.update(scheduled_at: 25.minutes.from_now)

          expect(Alerts::Create).not_to receive(:new)
          expect(create_alert_service).not_to receive(:execute)

          service.execute
        end
      end
    end

    it "removes order_changed alert in status 'in_progress'" do
      booking.update(status: 'in_progress')

      stub_remove_alert_service(:order_changed)

      expect(remove_alert_service).to receive(:execute)
      service.execute
    end
  end

  def stub_remove_alert_service(type)
    expect(Alerts::Remove).to receive(:new)
      .with(booking: booking, type: type)
      .and_return(remove_alert_service)
  end
end
