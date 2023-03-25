require 'rails_helper'

RSpec.describe Bookings::Updaters::Gett, type: :service do
  let(:vehicle)    { create(:vehicle, :gett) }
  let(:service_id) { '1136508172' }
  let(:booking)    { create(:booking, :without_passenger, vehicle: vehicle, service_id: service_id) }
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { distance: 10.0 }))
  end

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  # driver_attributes values correspond to the ones in fixture responses
  let(:driver_attributes) do
    {
      name: "Emma Anderson",
      image_url: "http://robohash.org/188474104.png",
      phone_number: "86136500348172611756",
      rating: 4.6,
      vehicle: {
        "model"         => "Mazda 3",
        "color"         => "Black",
        "license_plate" => "1026735551718025"
      },
      lat: 51.5172821,
      lng: -0.0823385999999573,
      pickup_lat: 51.5172821,
      pickup_lng: -0.0823385999999573,
      distance: 10.0,
      pickup_distance: 10.0,
      vendor_name: 'Gett'
    }
  end

  describe '#can_execute?' do
    subject { service.can_execute? }

    context 'when Gett booking' do
      let(:booking) { create(:booking, :gett) }
      it { is_expected.to be true }
    end

    context 'when OT booking' do
      let(:booking) { create(:booking, :ot) }
      it { is_expected.to be false }
    end
  end

  describe '#execute' do
    stub_channelling!

    before do
      Timecop.freeze Time.current.change(nsec: 0)

      stub_request(:post, %r(http://localhost/oauth/token)).to_return(status: 200)
      stub_request(:get, %r(http://localhost/business/rides)).to_return(status: 200, body: response_body)

      allow(Faye.bookings).to receive(:notify_update)
      allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub)
    end

    after { Timecop.return }

    context 'when response status is Routing' do
      let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_routing.json').read }
      let(:driver_attributes) do
        {
          pickup_lat: 51.5172821,
          pickup_lng: -0.0823385999999573
        }
      end

      it "updates status and creates driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.to change{ booking.reload.status }.from('order_received').to('locating')
          .and change(BookingDriver, :count).by(1)

        expect(booking.driver.values).to include(driver_attributes)
      end
    end

    context 'when response status is Waiting' do
      let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_waiting.json').read }

      it "updates status driver" do
        expect(Faye.bookings).to receive(:notify_update)
        expect{ service.execute }.to change{ booking.reload.status }.to('arrived')
        expect(booking.driver.values).to include(driver_attributes.merge(eta: 0, distance: nil, pickup_distance: nil))
      end

      it "updates booking's arrived_at" do
        expect{ service.execute }.to change{ booking.arrived_at }.from(nil).to(Time.current)
      end

      context "when response status was the same before" do
        before { booking.update(status: :arrived, arrived_at: 10.minutes.ago) }

        it "doesn't update booking's arrived_at" do
          expect{ service.execute }.to_not change{ booking.arrived_at }
        end
      end
    end

    describe 'update notification' do
      let(:response_body) { response.to_json }

      before { expect(Faye.bookings).to receive(:notify_update) }

      context 'when driver information changes' do
        let(:response) { {'status' => 'Confirmed', 'driver' => {'name' => 'Emma Anderson'}} }

        specify { service.execute }
      end

      context 'when driver location changes' do
        let(:ride) { {'driver' => {'name' => 'Emma Anderson'}} }

        let(:response) do
          {
            'status' => 'Confirmed',
            'driver' => {
              'name'     => 'Emma Anderson',
              'location' => {
                'latitude'  => 51.5172821,
                'longitude' => -0.0823385999999573
              }
            }
          }
        end

        specify { service.execute }
      end

      context 'when ETA changes' do
        let(:ride) { {'driver' => {'name' => 'Emma Anderson'}, 'eta' => 10} }

        let(:response) do
          {
            'status' => 'Confirmed',
            'driver' => {'name' => 'Emma Anderson'},
            'will_arrive_at' => (Time.current + 5.minutes).strftime('%d/%m/%Y %H:%M:%S')
          }
        end

        specify { service.execute }
      end
    end

    context "when booking has a driver" do
      let(:booking) do
        create(:booking,
          status:       'arrived',
          vehicle:      vehicle,
          service_id:   service_id
        )
      end

      let!(:booking_driver) { create :booking_driver, driver_attributes.merge(booking: booking) }

      context 'when response status is Driving' do
        let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_driving.json').read }

        it_behaves_like 'the one that updates driver path points',
          response_point: [51.5172821, -0.0823385999999573, 10, false]

        it "updates status and notifies on update" do
          expect(Faye.bookings).to receive(:notify_update)
          expect{ service.execute }.to change{ booking.reload.status }.to('in_progress')
        end

        it "updates booking's started_at" do
          expect{ service.execute }.to change{ booking.started_at }.from(nil).to(Time.current)
        end

        context "when response status was the same before" do
          before { booking.update(status: :in_progress, started_at: 10.minutes.ago) }

          it "doesn't update booking's started_at" do
            expect{ service.execute }.to_not change{ booking.started_at }
          end
        end

        context 'when no new information is received' do
          subject(:next_service) { described_class.new(booking: booking) }

          before do
            expect(Faye.bookings).to receive(:notify_update).once
            service.execute
            next_service.execute
          end

          it { is_expected.to be_success }
        end
      end

      context 'when response status is Complete' do
        let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_complete.json').read }

        it "updates booking status" do
          expect{ service.execute }.to change{ booking.reload.status }.to('completed')
        end

        it "updates booking's ended_at" do
          expect{ service.execute }.to change{ booking.ended_at }.from(nil).to(Time.current)
        end

        context "when response status was the same before" do
          before { booking.update(status: :completed, ended_at: 10.minutes.ago) }

          it "doesn't update booking's ended_at" do
            expect{ service.execute }.to_not change{ booking.ended_at }
          end
        end

        it "updates driver location" do
          expect{ service.execute }.to change { [booking.driver.lat, booking.driver.lng] }
            .to([51.5170151, -0.0816611000000194])
        end

        it "runs booking cost updater worker with a delay" do
          expect(BookingsChargesUpdater).to receive(:perform_in).with(10.minutes, booking.id)
          service.execute
        end

        it "notifies about update" do
          expect(Faye.bookings).to receive(:notify_update)
          service.execute
        end

        context 'calls Bookings::FutureBookingsNotifier' do
          it do
            expect(::Bookings::FutureBookingsNotifier).to receive_message_chain(:new, :execute)
            service.execute
          end

          it 'and notifies Faye' do
            expect(Faye).to receive(:notify)
            service.execute
          end
        end
      end

      context 'when response status is Cancelled' do
        let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_cancelled.json').read }

        it "updates booking status" do
          expect{ service.execute }.to change{ booking.reload.status }.to('cancelled')
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

      context 'when response status is Confirmed' do
        let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_confirmed.json').read }

        it "updates booking's status" do
          expect{ service.execute }.to change{ booking.status }.to('on_the_way')
        end

        it "updates booking's allocated_at" do
          expect{ service.execute }.to change{ booking.allocated_at }.from(nil).to(Time.current)
        end

        context "when response status was the same before" do
          before { booking.update(status: :on_the_way, allocated_at: 10.minutes.ago) }

          it "doesn't update booking's allocated_at" do
            expect{ service.execute }.to_not change{ booking.allocated_at }
          end
        end
      end
    end

    context 'when booking is eligible for rejection' do
      let(:response_body) { Rails.root.join('spec/fixtures/gett/ride_response_driving.json').read }
      let(:reject_booking_service) { double('Bookings::Reject') }

      before { booking.update(status: 'creating', scheduled_at: Time.current - 2.days - 1.minute) }

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
