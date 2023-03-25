require 'rails_helper'

RSpec.describe Bookings::ChargesUpdaters::Carey, type: :service do
  let(:company) do
    create(:company,
      handling_fee: 10.0,
      booking_fee: 2,
      phone_booking_fee: 3,
      tips: 5.0,
      run_in_fee: 5.0
    )
  end
  let(:booking) { create(:booking, :carey, :without_passenger, company: company, fare_quote: 10000) }

  subject(:service) { described_class.new(booking: booking) }

  before { allow(Faye.bookings).to receive(:notify_update) }

  describe '#execute' do
    it 'updates costs' do
      expect(booking.charges).to be_nil

      service.execute
      expect(booking.charges).to have_attributes(
        fare_cost: 10000,
        handling_fee: 1000,
        booking_fee: 200,
        free_waiting_time: 0,
        paid_waiting_time: 0,
        paid_waiting_time_fee: 0,
        stops_text: nil,
        stops_fee: 0,
        extra1: 0,
        extra2: 0,
        extra3: 0,
        phone_booking_fee: 0,
        tips: 500,
        run_in_fee: 500,
        vat: 340,
        total_cost: 12540,
        vatable_ride_fees: 0,
        non_vatable_ride_fees: 10000,
        service_fees: 1200,
        vatable_extra_fees: 500,
        non_vatable_extra_fees: 500
      )
    end

    it 'calls Payments::Create' do
      expect_any_instance_of(BookingPayments::Create).to receive(:execute!)
      service.execute
    end

    it 'calls notify_update' do
      expect(Faye.bookings).to receive(:notify_update).with(booking)
      service.execute
    end

    context 'when booking was created by reincarnated admin' do
      let(:booking) { create(:booking, :reincarnated, :carey, :without_passenger, company: company, fare_quote: 10000) }

      it 'updates costs and includes company booking fee' do
        service.execute
        expect(booking.charges).to have_attributes(
          phone_booking_fee: 300,
          total_cost: 12900
        )
      end
    end

    context 'when booking is not vatable' do
      before do
        allow(booking).to receive(:vatable?).and_return(false)
      end

      it 'updates cost except vat' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 1000,
          booking_fee: 200,
          free_waiting_time: 0,
          paid_waiting_time: 0,
          paid_waiting_time_fee: 0,
          stops_text: nil,
          stops_fee: 0,
          extra1: 0,
          extra2: 0,
          extra3: 0,
          phone_booking_fee: 0,
          tips: 500,
          run_in_fee: 500,
          vat: 0,
          total_cost: 12200
        )
      end
    end

    context 'when booking was cancelled' do
      before do
        booking.company_info.update(
          carey_cancellation_before_arrival_fee: 25,
          carey_cancellation_after_arrival_fee: 50
        )
      end

      context 'when driver has arrived' do
        before do
          booking.update(
            status: 'cancelled',
            status_before_cancellation: 'arrived',
            cancellation_fee: true,
            cancelled_at: booking.scheduled_at - 5.minutes
          )
        end

        it 'calculates cancellation charge' do
          service.execute
          expect(booking.charges).to have_attributes(
            cancellation_fee: 5000,
            vat: 1000,
            total_cost: 6000
          )
        end
      end

      context 'within 3 hours of scheduled time' do
        before do
          booking.update(
            status: 'cancelled',
            status_before_cancellation: 'locating',
            cancellation_fee: true,
            cancellation_requested_at: booking.scheduled_at - 2.hours
          )
        end

        context 'driver is not assigned' do
          it 'calculates cancellation charge' do
            service.execute
            expect(booking.charges).to have_attributes(
              cancellation_fee: 0,
              vat: 0,
              total_cost: 0
            )
          end

          context 'when order is not asap' do
            before { booking.update(asap: false) }

            it 'calculates cancellation charge' do
              service.execute
              expect(booking.charges).to have_attributes(
                cancellation_fee: 2500,
                vat: 500,
                total_cost: 3000
              )
            end
          end
        end

        context 'driver is assigned' do
          before { create(:booking_driver, booking: booking) }

          it 'calculates cancellation charge' do
            service.execute
            expect(booking.charges).to have_attributes(
              cancellation_fee: 2500,
              vat: 500,
              total_cost: 3000
            )
          end
        end
      end

      context 'more than 3 hours before scheduled time' do
        before do
          booking.update(
            status: 'cancelled',
            status_before_cancellation: 'locating',
            cancellation_fee: true,
            cancellation_requested_at: booking.scheduled_at - 4.hours
          )
        end

        it 'calculates cancellation charge' do
          service.execute
          expect(booking.charges).to have_attributes(
            cancellation_fee: 0,
            vat: 0,
            total_cost: 0
          )
        end
      end
    end
  end
end
