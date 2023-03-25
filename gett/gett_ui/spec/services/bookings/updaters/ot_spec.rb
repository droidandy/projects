require 'rails_helper'

RSpec.describe Bookings::Updaters::OT, type: :service do
  let(:vehicle) { create(:vehicle, :one_transport) }
  let(:booking) do
    create(:booking, :without_passenger,
      vehicle: vehicle,
      service_id: 'AC95213'
    )
  end

  subject(:service) { described_class.new(booking: booking) }

  let(:vehicle_structure) { {} }
  let(:response) do
    double(body: {
      vehicle_location_response: {
        vehicle_location_result: {
          header: {
            result: {
              code: '0',
              message: nil
            }
          },
          vehicle_availabilities: {
            vehicle_availabilty_structure: vehicle_structure
          }
        }
      }
    })
  end
  let(:savon_client) { double(operations: [:vehicle_location]) }
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0, duration_sec: 300 }))
  end

  describe '#can_execute?' do
    subject { service.can_execute? }

    context 'when Gett booking' do
      let(:booking) { create(:booking, :gett) }
      it { is_expected.to be false }
    end

    context 'when OT booking' do
      let(:booking) { create(:booking, :ot) }
      it { is_expected.to be false }

      context 'when booked_at is current time' do
        let(:booking) { create(:booking, :ot, booked_at: Time.current) }
        it { is_expected.to be false }
      end

      context 'when booked_at is more then delay ago' do
        let(:booking) { create(:booking, :ot, booked_at: 1.hour.ago) }
        it { is_expected.to be true }
      end
    end
  end

  describe '#execute' do
    let(:notify_passenger_service) { double }

    before do
      Timecop.freeze(Time.current.change(nsec: 0))
      allow(Savon).to receive(:client)
        .with(
          wsdl: 'http://localhost/ot',
          element_form_default: :qualified,
          convert_request_keys_to: :camelcase
        )
        .and_return(savon_client)
      allow(savon_client).to receive(:call).and_return(response)
      allow(Faye.bookings).to receive(:notify_update)
      allow(Bookings::NotifyPassenger).to receive(:new).with(booking: booking).and_return(notify_passenger_service)
      allow(notify_passenger_service).to receive(:execute)
      allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub)
    end

    after { Timecop.return }

    context 'when request does not succeed' do
      let(:response) do
        double(body: {
          vehicle_location_response: {
            vehicle_location_result: {
              header: {
                result: {
                  code: '1',
                  message: 'Some error'
                }
              }
            }
          }
        })
      end

      it "doesn't update status and doesn't add a driver" do
        expect(Faye.bookings).not_to receive(:notify_update)
        expect{ service.execute }.not_to change{ booking.reload.status }
        expect(booking.driver).to be_blank
      end

      context 'when status is order_received' do
        context 'and asap booking created more than 5 minutes ago' do
          let(:booking) { create(:booking, created_at: 6.minutes.ago) }

          it 'sets status to processing' do
            service.execute
            expect(booking.reload.status).to eq 'processing'
          end
        end

        context 'and asap booking created less than 5 minutes ago' do
          let(:booking) { create(:booking, created_at: 4.minutes.ago) }

          it 'leave status as order_received' do
            service.execute
            expect(booking.reload.status).to eq 'order_received'
          end
        end

        context 'with future booking' do
          # Create future booking and then move current time
          # to be sure just created booking is valid
          let!(:booking) { create(:booking, :future, scheduled_at: Time.current + 2.hours) }

          context 'and schedule time is in less then 15 minutes' do
            before do
              Timecop.freeze(Time.current + 1.hour + 46.minutes)
            end

            it 'sets status to processing' do
              service.execute
              expect(booking.reload.status).to eq 'processing'
            end
          end

          context 'and schedule time is in more then 15 minutes' do
            before do
              Timecop.freeze(Time.current + 1.hour + 44.minutes)
            end

            it 'leave status as order_received' do
              service.execute
              expect(booking.reload.status).to eq 'order_received'
            end
          end
        end
      end
    end

    context 'when job_status is Prebooked' do
      let(:vehicle_structure) { { vehicle_state: 'None' } }

      it "updates status, ot_vehicle_state, but doesn't add driver and doesn't send update notification" do
        expect(Faye.bookings).not_to receive(:notify_update)
        expect{ service.execute }.not_to change(BookingDriver, :count)
        expect(booking.reload.status).to eq 'order_received'
        expect(booking.ot_vehicle_state).to eq 'None'
      end

      context 'when future booking scheduled time is in less then 15 minutes' do
        let!(:booking) { create(:booking, :future, scheduled_at: Time.current + 60.minutes) }

        before do
          Timecop.freeze(Time.current + 60.minutes)
        end

        it 'sets status to processing' do
          service.execute
          expect(booking.reload.status).to eq 'processing'
        end
      end

      context 'when asap booking created more than 5 minutes ago' do
        let(:booking) { create(:booking, created_at: 6.minutes.ago) }

        it 'sets status to processing' do
          service.execute
          expect(booking.reload.status).to eq 'processing'
        end
      end
    end

    context 'when vehicle state is None' do
      let(:vehicle_structure) do
        {
          distance_to_pickup_miles: "0",
          distance_to_pickup_km: "0",
          eta: (Time.current + 90.minutes).strftime('%d/%m/%Y %H:%M:%S'),
          vehicle_state: 'None',
          location: {
            latitude: '51.509103',
            longitude: '-0.088234',
            GRN: '169600',
            GRE: '532900',
            URN: '21753324'
          },
          vehicle: {
            vehicle_ref: 'V ZCL6X2',
            driver_ref: 'V ZCL6X2',
            reg_no: 'V ZCL6X2',
            make: nil,
            colour: nil,
            driver_name: 'Tony Carroll',
            description: 'SILVER VITO',
            vendor_name: 'Gett London',
            v_class: 'Standard',
            v_type: 'Taxi',
            driver_mobile_number: '123123123'
          }
        }
      end
      let(:driver_attributes) do
        {
          eta: 5,
          lat: 51.509103,
          lng: -0.088234,
          name: 'Tony Carroll',
          phone_number: '123123123'
        }
      end

      it "does not update status, but adds driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.not_to change{ booking.reload.status }

        expect(booking.driver.values).to include(driver_attributes)
      end
    end

    %w(Free Offline Busy).each do |vehicle_state|
      context "when vehicle state is #{vehicle_state}" do
        let(:vehicle_structure) { { vehicle_state: vehicle_state } }

        it "updates status and adds driver" do
          expect(Faye.bookings).to receive(:notify_update)
          expect{ service.execute }.to change{ booking.reload.status }.to('locating')
            .and change{ booking.ot_vehicle_state }.to(vehicle_state)
          expect(booking.ot_vehicle_state).to eq(vehicle_state)
        end
      end
    end

    context 'when vehicle state is Allocated' do
      let(:vehicle_structure) { { vehicle_state: 'Allocated' } }

      describe 'status updates' do
        after do
          expect(Faye.bookings).to have_received(:notify_update)
          expect(notify_passenger_service).to have_received(:execute)
        end

        it "updates status and doesn't add driver" do
          expect{ service.execute }.to change{ booking.reload.status }.to('on_the_way')
            .and change{ booking.ot_vehicle_state }.to('Allocated')
        end

        it 'updates allocated_at' do
          expect{ service.execute }.to change(booking, :allocated_at).from(nil).to(Time.current)
        end
      end

      context 'when booking is scheduled' do
        describe 'update offsets' do
          let(:scheduled_at) { 4.hours.from_now }
          let(:booking) do
            create(:booking, :without_passenger, :ot,
              vehicle: vehicle,
              service_id: 'AC95213',
              scheduled_at: scheduled_at
            )
          end

          it "doesn't update booking's status" do
            expect{ service.execute }.not_to change(booking, :status)
          end

          it "doesn't update booking's allocated_at" do
            expect{ service.execute }.not_to change(booking, :allocated_at)
          end

          context 'when booking is scheduled 55 minutes from now' do
            let(:scheduled_at) { 55.minutes.from_now }

            it "updates booking's status, ot_vehicle_state and allocated_at" do
              expect{ service.execute }.to change{ booking.status }.to('on_the_way')
                .and change{ booking.ot_vehicle_state }.to('Allocated')
                .and change{ booking.allocated_at }.from(nil).to(Time.current)
            end
          end

          context 'when booking is scheduled 10 minutes from now' do
            let(:scheduled_at) { 10.minutes.from_now }

            it "updates booking's status, ot_vehicle_state and allocated_at" do
              expect{ service.execute }.to change{ booking.status }.to('on_the_way')
                .and change{ booking.ot_vehicle_state }.to('Allocated')
                .and change{ booking.allocated_at }.from(nil).to(Time.current)
            end
          end
        end
      end

      context "when booking is in 'on_the_way' status" do
        before { booking.update(status: :on_the_way, allocated_at: 10.minutes.ago) }

        it "doesn't update booking's allocated_at" do
          expect{ service.execute }.to_not change{ booking.allocated_at }
        end
      end

      context 'when initial booking status is on_the_way and eta changes' do
        let(:vehicle_structure) { { vehicle_state: 'Allocated', eta: (Time.current + eta.minutes).strftime('%d/%m/%Y %H:%M:%S') } }
        let(:booking) { create :booking, status: 'on_the_way' }
        let(:eta) { 30 }

        before { create :booking_driver, booking: booking, eta: 40 }

        it 'calls notify_update' do
          expect(Faye.bookings).to receive(:notify_update)
          service.execute
        end
      end
    end

    context 'when vehicle state is Arrived' do
      let(:vehicle_structure) { { vehicle_state: 'Arrived', vehicle: {driver_name: 'John'} } }
      let(:driver_attributes) { { name: 'John' } }

      it "updates status and adds driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.to change{ booking.reload.status }.to('arrived')
          .and change{ booking.ot_vehicle_state }.to('Arrived')
          .and change(BookingDriver, :count).by(1)

        expect(booking.driver.values).to include(driver_attributes)
      end

      it 'updates arrived_at' do
        expect{ service.execute }.to change{ booking.arrived_at }.from(nil).to(Time.current)
      end

      context "when response status was the same before" do
        before { booking.update(status: :arrived, arrived_at: 10.minutes.ago) }

        it "doesn't update booking's arrived_at" do
          expect{ service.execute }.to_not change{ booking.arrived_at }
        end
      end

      context 'when booking is scheduled' do
        describe 'update offsets' do
          let(:scheduled_at) { 4.hours.from_now }
          let(:booking) do
            create :booking, :without_passenger, :ot,
              vehicle: vehicle,
              service_id: 'AC95213',
              scheduled_at: scheduled_at
          end

          it "doesn't update booking's status" do
            expect{ service.execute }.not_to change{ booking.status }
          end

          it "doesn't update booking's arrived_at" do
            expect{ service.execute }.not_to change{ booking.arrived_at }
          end

          context 'when booking is scheduled 55 minutes from now' do
            let(:scheduled_at) { 55.minutes.from_now }

            it "doesn't update booking's status" do
              expect{ service.execute }.not_to change{ booking.status }
            end

            it "doesn't update booking's arrived_at" do
              expect{ service.execute }.not_to change{ booking.arrived_at }
            end
          end

          context 'when booking is scheduled 10 minutes from now' do
            let(:scheduled_at) { 10.minutes.from_now }

            it "updates booking's status, ot_vehicle_state and arrived_at" do
              expect{ service.execute }.to change{ booking.status }.to('arrived')
                .and change{ booking.ot_vehicle_state }.to('Arrived')
                .and change{ booking.arrived_at }.from(nil).to(Time.current)
            end
          end
        end
      end
    end

    context 'when vehicle state is POB' do
      let(:vehicle_structure) do
        {
          vehicle_state: 'POB',
          location: {
            latitude: '51.509103',
            longitude: '-0.088234'
          }
        }
      end

      let(:driver_attributes) do
        {
          lat: 51.509103,
          lng: -0.088234
        }
      end

      it "updates status and adds driver" do
        expect{ service.execute }.to change{ booking.reload.status }.to('in_progress')
          .and change{ booking.ot_vehicle_state }.to('POB')
        expect(booking.driver.values).to include(driver_attributes)
      end

      it 'updates started_at' do
        expect{ service.execute }.to change{ booking.started_at }.from(nil).to(Time.current)
      end

      context "when response status was the same before" do
        before { booking.update(status: :in_progress, started_at: 10.minutes.ago) }

        it "doesn't update booking's started_at" do
          expect{ service.execute }.to_not change{ booking.started_at }
        end
      end

      it_behaves_like 'the one that updates driver path points',
        response_point: [51.509103, -0.088234, 0, false]
    end

    context 'when vehicle state is Cancelled' do
      let(:vehicle_structure) { { vehicle_state: 'Cancelled' } }

      it "updates status and doesn't add driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.to change{ booking.reload.status }.to('cancelled')
          .and change{ booking.ot_vehicle_state }.to('Cancelled')
      end

      it "updates booking's ended_at" do
        expect{ service.execute }.to change{ booking.cancelled_at }.from(nil).to(Time.current)
      end

      context "when response status was the same before" do
        before { booking.update(status: :cancelled, cancelled_at: 10.minutes.ago) }

        it "doesn't update booking's cancelled_at" do
          expect{ service.execute }.to_not change{ booking.cancelled_at }
        end
      end
    end

    context 'when vehicle state is Completed' do
      let(:vehicle_structure) { { vehicle_state: 'Completed', vehicle: {driver_name: 'John'} } }
      let(:driver_attributes) { { name: 'John' } }

      it "updates status and adds driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.to change{ booking.reload.status }.to('completed')
          .and change{ booking.ot_vehicle_state }.to('Completed')

        expect(booking.driver.values).to include(driver_attributes)
      end

      it 'updates ended_at' do
        expect{ service.execute }.to change{ booking.ended_at }.from(nil).to(Time.current)
      end

      context "when response status was the same before" do
        before { booking.update(status: :completed, ended_at: 10.minutes.ago) }

        it "doesn't update booking's ended_at" do
          expect{ service.execute }.to_not change{ booking.ended_at }
        end
      end

      it "runs booking cost updater worker" do
        expect(BookingsChargesUpdater).to receive(:perform_async).with(booking.id)
        service.execute
      end
    end

    context 'when booking is eligible for rejection' do
      let(:reject_booking_service) { double('Bookings::Reject') }

      before { booking.update(status: 'creating', scheduled_at: Time.current - 1.day - 1.minute) }

      it 'rejects booking' do
        expect(Bookings::Reject).to receive(:new)
          .with(booking: booking).and_return(reject_booking_service)
        expect(reject_booking_service).to receive_message_chain(:execute, :result)
        service.execute
      end

      context 'but in production env' do
        before { expect(Rails.env).to receive(:production?).and_return(true) }

        it 'continues checking for booking updates' do
          expect(Bookings::Reject).not_to receive(:new).with(booking: booking)
          service.execute
        end
      end
    end
  end
end
