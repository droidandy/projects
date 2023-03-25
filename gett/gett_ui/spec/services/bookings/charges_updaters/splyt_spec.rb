require 'rails_helper'

RSpec.describe Bookings::ChargesUpdaters::Splyt do
  let(:address) { create(:address) }
  let(:booking) { create(:booking, :splyt, :without_passenger, pickup_address: address, fare_quote: 10000) }

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
        phone_booking_fee: 0,
        tips: 0,
        vat: 0,
        total_cost: 10000,
        vatable_ride_fees: 0,
        non_vatable_ride_fees: 10000,
        service_fees: 0,
        vatable_extra_fees: 0,
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
          splyt_cancellation_before_arrival_fee: 25,
          splyt_cancellation_after_arrival_fee: 50
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
        create(:booking, :reincarnated, :splyt, :without_passenger, fare_quote: 10000, booker: admin)
      end

      it 'updates costs and includes company booking fee' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 1000,
          booking_fee: 2000,
          phone_booking_fee: 500,
          tips: 550,
          vat: 700,
          total_cost: 14750
        )
      end
    end

    context 'when booking is international' do
      let(:address) { create(:address, country_code: 'IL') }

      before { booking.company_info.update(international_booking_fee: 10) }

      it 'calculates cancellation charge' do
        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 0,
          booking_fee: 0,
          phone_booking_fee: 0,
          international_booking_fee: 1000,
          tips: 0,
          vat: 200,
          total_cost: 11200
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

      let(:booking) { create(:booking, :splyt, :without_passenger, fare_quote: 10000, company: company) }

      before do
        allow(booking).to receive(:vatable?).and_return(false)
      end

      it 'updates cost except vat' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 10000,
          handling_fee: 1000,
          booking_fee: 2000,
          phone_booking_fee: 0,
          tips: 550,
          vat: 0,
          total_cost: 13550
        )
      end
    end
  end
end
