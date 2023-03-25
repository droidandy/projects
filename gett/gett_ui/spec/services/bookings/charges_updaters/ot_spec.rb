require 'rails_helper'

RSpec.describe Bookings::ChargesUpdaters::OT, type: :service do
  let(:booking) { create(:booking, :ot, :without_passenger, fare_quote: 10000, ot_extra_cost: 100) }

  subject(:service) { described_class.new(booking: booking) }

  before { allow(Faye.bookings).to receive(:notify_update) }

  describe '#execute' do
    it 'updates costs' do
      expect(booking.charges).to be_nil

      service.execute
      expect(booking.charges).to have_attributes(
        fare_cost: 10000,
        handling_fee: 0,
        booking_fee: 0,
        free_waiting_time: 0,
        paid_waiting_time: 0,
        paid_waiting_time_fee: 0,
        stops_text: nil,
        stops_fee: 0,
        extra1: 100,
        phone_booking_fee: 0,
        tips: 0,
        vat: 2020,
        total_cost: 12120,
        vatable_ride_fees: 10000,
        non_vatable_ride_fees: 0,
        service_fees: 0,
        vatable_extra_fees: 100,
        non_vatable_extra_fees: 0
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

    context 'when booking was cancelled' do
      before do
        booking.company_info.update(
          cancellation_before_arrival_fee: 25,
          cancellation_after_arrival_fee: 50
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

    context 'when booking was created by reincarnated admin' do
      let(:company) do
        create(:company,
          phone_booking_fee: 5.0,
          handling_fee: 10,
          booking_fee: 20,
          tips: 5.5
        )
      end
      let(:admin)   { create(:admin, company: company) }
      let(:booking) do
        create(:booking, :reincarnated, :ot, :without_passenger, fare_quote: 10000, booker: admin)
      end

      it 'updates costs and includes company booking fee' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 1000,
          booking_fee: 2000,
          free_waiting_time: 0,
          paid_waiting_time: 0,
          paid_waiting_time_fee: 0,
          stops_text: nil,
          stops_fee: 0,
          extra1: 0,
          phone_booking_fee: 500,
          tips: 550,
          vat: 2700,
          total_cost: 16750
        )
      end
    end

    context 'when booking has 0 ot_waiting_time' do
      before { booking.update(ot_waiting_time: 0) }

      it 'does not include paid waiting time' do
        service.execute
        expect(booking.charges).to have_attributes(
          free_waiting_time: 0,
          paid_waiting_time: 0,
          paid_waiting_time_fee: 0,
          total_cost: 12120
        )
      end
    end

    context 'when booking has 20 minutes ot_waiting_time' do
      before { booking.update(ot_waiting_time: 20.minutes) }

      it 'does not include paid waiting time' do
        service.execute
        expect(booking.charges).to have_attributes(
          free_waiting_time: 0,
          paid_waiting_time: 1200,
          paid_waiting_time_fee: 860,
          total_cost: 13152
        )
      end
    end

    context 'when booking is not vatable' do
      let(:company) do
        create(:company,
          phone_booking_fee: 5.0,
          handling_fee: 10,
          booking_fee: 20,
          tips: 5.5
        )
      end

      let(:booking) { create(:booking, :reincarnated, :ot, :without_passenger, fare_quote: 10000, company: company) }

      before do
        allow(booking).to receive(:vatable?).and_return(false)
      end

      it 'updates costs except vat' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 1000,
          booking_fee: 2000,
          free_waiting_time: 0,
          paid_waiting_time: 0,
          paid_waiting_time_fee: 0,
          stops_text: nil,
          stops_fee: 0,
          extra1: 0,
          phone_booking_fee: 500,
          tips: 550,
          vat: 0,
          total_cost: 14050
        )
      end
    end
  end
end
