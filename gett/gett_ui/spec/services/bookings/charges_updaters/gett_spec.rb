require 'rails_helper'

RSpec.describe Bookings::ChargesUpdaters::Gett, type: :service do
  let(:vehicle) { create(:vehicle, :gett, name: 'product') }
  let(:service_id) { '1136508172' }
  let(:company) { create(:company) }
  let(:address) { create(:address, :baker_street) }
  let(:booking) { create(:booking, :gett, :without_passenger, company: company, vehicle: vehicle, service_id: service_id, pickup_address: address) }

  subject(:service) { described_class.new(booking: booking) }

  before do
    response = double(body: response_body, code: 200)
    allow(Gett::Authenticate).to receive(:new).and_return(double(execute: true))
    allow(RestClient).to receive(:get).and_return(response)
    allow(Faye.bookings).to receive(:notify_update)
  end

  describe '#execute' do
    let(:response_body) { Rails.root.join('spec/fixtures/gett/receipt_response.json').read }
    let(:request)       { Request.last }

    context 'when request succeed' do
      it 'updates costs' do
        expect(booking.charges).to be_nil

        service.execute
        expect(booking.charges).to have_attributes(
          fare_cost: 5304,
          handling_fee: 1061,
          booking_fee: 150,
          free_waiting_time: 180,
          paid_waiting_time: 5353,
          paid_waiting_time_fee: 1450,
          stops_text: "+1.24 mi",
          stops_fee: 610,
          extra1: 2500,
          extra2: 200,
          extra3: 1000,
          phone_booking_fee: 0,
          cancellation_fee: 0,
          tips: 530,
          vat: 564,
          total_cost: 14369,
          vatable_ride_fees: 0,
          non_vatable_ride_fees: 5304,
          service_fees: 1211,
          vatable_extra_fees: 1610,
          non_vatable_extra_fees: 5680
        )

        expect(request.response_payload).to include('charges', 'duration', 'distance', 'distance_label')
      end

      context 'with fx rate increase' do
        let(:company) { create(:company, system_fx_rate_increase_percentage: 100) }

        before do
          allow(booking).to receive(:international?).and_return(international)
          expect(booking.charges).to be_nil
          service.execute
        end

        context 'when it applicable for international booking' do
          let(:international) { true }

          it 'set a double fare cost' do
            expect(booking.charges.fare_cost).to eq(10608)
          end
        end

        context 'when it not applicable for local booking' do
          let(:international) { false }

          it 'set a double fare cost' do
            expect(booking.charges.fare_cost).to eq(5304)
          end
        end
      end

      it 'calls BookingPayments::Create' do
        expect_any_instance_of(BookingPayments::Create).to receive(:execute!)
        service.execute
      end

      it 'calls notify_update' do
        expect(Faye.bookings).to receive(:notify_update).with(booking)
        service.execute
      end

      context 'when fare_cost is nil' do
        let(:response_body) do
          {
            "duration": "00:19:56",
            "distance": 14.3606,
            "distance_label": "miles"
          }.to_json
        end

        it 'updates costs' do
          service.execute
          expect(booking.charges).to have_attributes(
            fare_cost: 0,
            handling_fee: 0,
            booking_fee: 0,
            free_waiting_time: 0,
            paid_waiting_time: 0,
            paid_waiting_time_fee: 0,
            stops_text: nil,
            stops_fee: 0,
            extra1: 0,
            extra2: 0,
            extra3: 0,
            phone_booking_fee: 0,
            cancellation_fee: 0,
            tips: 0,
            vat: 0,
            total_cost: 0
          )
        end
      end

      context 'when booking was cancelled' do
        before do
          booking.company_info.update(
            gett_cancellation_before_arrival_fee: 10,
            gett_cancellation_after_arrival_fee: 20
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
              cancellation_fee: 2000,
              paid_waiting_time_fee: 1450,
              vat: 400,
              total_cost: 3850
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
                paid_waiting_time_fee: 1450,
                vat: 0,
                total_cost: 1450
              )
            end

            context 'when order is not asap' do
              before { booking.update(asap: false) }

              it 'calculates cancellation charge' do
                service.execute
                expect(booking.charges).to have_attributes(
                  cancellation_fee: 1000,
                  paid_waiting_time_fee: 1450,
                  vat: 200,
                  total_cost: 2650
                )
              end
            end

            context 'when cancellation time is unknown' do
              before do
                booking.update(
                  status: 'cancelled',
                  cancelled_at: nil,
                  cancellation_requested_at: nil,
                  asap: false
                )
              end

              it 'calculates cancellation charge' do
                service.execute
                expect(booking.charges).to have_attributes(
                  cancellation_fee: 1000,
                  paid_waiting_time_fee: 1450,
                  vat: 200,
                  total_cost: 2650
                )
              end
            end
          end

          context 'driver is assigned' do
            before { create(:booking_driver, booking: booking) }

            it 'calculates cancellation charge' do
              service.execute
              expect(booking.charges).to have_attributes(
                cancellation_fee: 1000,
                paid_waiting_time_fee: 1450,
                vat: 200,
                total_cost: 2650
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
              paid_waiting_time_fee: 1450,
              vat: 0,
              total_cost: 1450
            )
          end
        end

        context 'when booking was international' do
          before do
            allow(booking).to receive(:international?).and_return(true)
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
              cancellation_fee: 2000,
              paid_waiting_time_fee: 1450,
              vat: 0,
              total_cost: 3450
            )
          end
        end
      end

      context 'when booking was created by reincarnated admin' do
        let(:company) { create(:company, phone_booking_fee: 5.0) }
        let(:admin)   { create(:admin, company: company) }
        let(:booking) { create(:booking, :reincarnated, :without_passenger, booker: admin, vehicle: vehicle, service_id: service_id) }

        it 'updates costs and includes company booking fee' do
          expect(booking.charges).to be_nil

          service.execute
          expect(booking.charges).to have_attributes(
            fare_cost: 5304,
            handling_fee: 1061,
            booking_fee: 150,
            free_waiting_time: 180,
            paid_waiting_time: 5353,
            paid_waiting_time_fee: 1450,
            stops_text: "+1.24 mi",
            stops_fee: 610,
            extra1: 2500,
            extra2: 200,
            extra3: 1000,
            phone_booking_fee: 500,
            cancellation_fee: 0,
            tips: 530,
            vat: 664,
            total_cost: 14969
          )

          expect(request.response_payload).to include('charges', 'duration', 'distance', 'distance_label')
        end
      end

      context 'when booking is international' do
        let(:company) { create(:company, international_booking_fee: 15.0) }

        before do
          allow(booking).to receive(:international?).and_return(true)
          service.execute
        end

        it 'calculates international booking fee based on company data' do
          expect(booking.charges).to have_attributes(
            fare_cost: 5304,
            international_booking_fee: 796,
            vat: 723,
            total_cost: 15324
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
            fare_cost: 5304,
            handling_fee: 1061,
            booking_fee: 150,
            free_waiting_time: 180,
            paid_waiting_time: 5353,
            paid_waiting_time_fee: 1450,
            stops_text: "+1.24 mi",
            stops_fee: 610,
            extra1: 2500,
            extra2: 200,
            extra3: 1000,
            phone_booking_fee: 0,
            cancellation_fee: 0,
            tips: 530,
            vat: 0,
            total_cost: 13805
          )
        end
      end

      context 'when booking is via' do
        let(:company) do
          create(:company,
            handling_fee: 20,
            booking_fee: 2.42,
            run_in_fee: 3.56,
            phone_booking_fee: 4.78,
            gett_cancellation_before_arrival_fee: 5.12,
            gett_cancellation_after_arrival_fee: 6.32
          )
        end

        before { allow(booking).to receive(:via?).and_return(true) }

        it 'updates charges properly' do
          service.execute
          expect(booking.charges).to have_attributes(
            fare_cost: 5304,
            handling_fee: 1061,
            booking_fee: 242,
            run_in_fee: 356,
            free_waiting_time: 180,
            paid_waiting_time: 5353,
            paid_waiting_time_fee: 1450,
            stops_text: "+1.24 mi",
            stops_fee: 610,
            extra1: 2500,
            extra2: 200,
            extra3: 1000,
            phone_booking_fee: 0,
            cancellation_fee: 0,
            tips: 530,
            additional_fee: 1000,
            vat: 2745, # (5304 + 1450 + 2500 + 200 + 1000 + 610 + 1000 + 356 + 242 + 1061) * 0.2 = 2744.6
            total_cost: 16998 # 530 + (5304 + 1450 + 2500 + 200 + 1000 + 610 + 1000 + 356 + 242 + 1061) * 1.2 = 16997.6
          )
        end

        context 'when booking is cancelled' do
          before do
            allow(service).to receive(:cancellation_fee_type).and_return(cancellation_fee_type)
            allow(booking).to receive(:via?).and_return(true)
            booking.update(status: 'cancelled', cancellation_fee: true, cancelled_at: booking.scheduled_at - 5.minutes)
          end

          context 'cancellation before arrival' do
            let(:cancellation_fee_type) { :before_arrival }

            it 'updates charges properly' do
              service.execute
              expect(booking.charges).to have_attributes(
                fare_cost: 0,
                handling_fee: 0,
                booking_fee: 0,
                free_waiting_time: 180,
                paid_waiting_time: 5353,
                paid_waiting_time_fee: 1450,
                stops_text: nil,
                stops_fee: 0,
                extra1: 0,
                extra2: 0,
                extra3: 0,
                phone_booking_fee: 0,
                cancellation_fee: 512,
                tips: 0,
                vat: 392, # (1450 + 512) * 0.2 = 392.4
                total_cost: 2354 # (1450 + 512) * 1.2 = 2354.4
              )
            end
          end

          context 'cancellation after arrival' do
            let(:cancellation_fee_type) { :after_arrival }

            it 'updates charges properly' do
              service.execute
              expect(booking.charges).to have_attributes(
                fare_cost: 0,
                handling_fee: 0,
                booking_fee: 0,
                free_waiting_time: 180,
                paid_waiting_time: 5353,
                paid_waiting_time_fee: 1450,
                stops_text: nil,
                stops_fee: 0,
                extra1: 0,
                extra2: 0,
                extra3: 0,
                phone_booking_fee: 0,
                cancellation_fee: 632,
                tips: 0,
                vat: 416, # (1450 + 632) * 1.2 = 416.4
                total_cost: 2498 # (1450 + 632) * 1.2 = 2498.4
              )
            end
          end
        end
      end
    end

    context 'when request failed' do
      let(:error_response) { double(body: 'Error', code: 400) }
      let(:error) { RestClient::BadRequest.new }

      before do
        allow(error).to receive(:response).and_return(error_response)
        allow(RestClient).to receive(:get).and_raise(error)
        allow(Timezones).to receive(:timezone_at).and_return('Europe/London')
      end

      it 'does not update costs' do
        expect(Airbrake).to receive(:notify)
        expect{ service.execute }.not_to change{ booking.charges }
        expect(request.response_payload).to be_nil
      end
    end
  end
end
