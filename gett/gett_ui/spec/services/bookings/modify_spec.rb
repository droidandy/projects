require 'rails_helper'

RSpec.describe Bookings::Modify, type: :service do
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  before { allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub) }

  let(:company)  { create(:company) }
  let(:admin)    { create(:admin, company: company) }
  let!(:booking) { create(:booking, :scheduled, vehicle: ot_vehicle, scheduled_at: scheduled_at, booker: admin) }
  let(:ot_vehicle) { create(:vehicle, :one_transport, earliest_available_in: 10) }

  let(:gett_response) do
    double(
      execute: double(
        success?: true,
        normalized_response: { service_id: "7828513267" }
      )
    )
  end
  let(:ot_response) do
    double(
      execute: double(
        success?: true,
        normalized_response: {
          ot_confirmation_number: "1000293548",
          service_id: "AC93573",
          fare_quote: 1000
        }
      )
    )
  end

  let(:scheduled_at) { 1.hour.from_now }
  let(:new_scheduled_at) { 2.hours.from_now }
  let(:carey_response) do
    double(
      execute: double(
        success?: true,
        normalized_response: { service_id: "WA10701621-1" }
      )
    )
  end

  let(:params) { {} }

  subject(:service) { described_class.new(booking: booking, params: params) }

  before { allow(Faye.bookings).to receive(:notify_update) }

  service_context { {company: company, member: admin, user: admin} }

  describe '#execute' do
    before do
      allow(Gett::Create).to receive(:new).and_return(gett_response)
      allow(Gett::Modify).to receive(:new).and_return(gett_response)
      allow(OneTransport::Create).to receive(:new).and_return(ot_response)
      allow(OneTransport::Modify).to receive(:new).and_return(ot_response)
      allow(Alerts::FlightChecker).to receive(:new).and_return(double(execute: true))
      allow(Carey::Create).to receive(:new).and_return(carey_response)
      allow(Carey::Modify).to receive(:new).and_return(carey_response)

      stub_request(:get, %r(http://localhost/ot)).to_timeout
    end

    let!(:vehicle_vendor) { create(:vehicle_vendor) }
    let!(:new_vehicle)    { create(:vehicle, :gett, vehicle_vendor_pks: [vehicle_vendor.id]) }
    let(:flight) { 'New flight' }
    let(:params) do
      {
        message: 'New message',
        flight: flight,
        vehicle_value: new_vehicle.value,
        vehicle_vendor_id: vehicle_vendor.id,
        vehicle_price: 1234,
        scheduled_at: new_scheduled_at,
        payment_method: 'account',
        international_flag: true,
        pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup', country_code: 'GB', city: 'London' },
        destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown', country_code: 'GB', city: 'London' },
        stops: [
          {
            name: 'Bob',
            phone: '777888666555',
            address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', country_code: 'GB', city: 'London' }
          }
        ]
      }
    end

    it 'does not create new booking' do
      expect{ service.execute }.not_to change(Booking, :count)
    end

    describe 'passenger phone changes' do
      let(:passenger_phone) { '+79997777777' }
      let(:params) { super().merge(passenger_phone: passenger_phone) }

      it 'update phone in booking' do
        expect{ service.execute }.to change{ booking.passenger_phone }.to(passenger_phone)
      end
    end

    describe 'flight changes' do
      before { service.execute }

      context 'when the flight changes' do
        it 'calls Alerts::FlightChecker' do
          expect(Alerts::FlightChecker).to have_received(:new).with(booking: booking).once
        end
      end

      context 'when the flight stays the same' do
        let(:flight) { nil }

        it 'does not calls Alerts::FlightChecker' do
          expect(Alerts::FlightChecker).to_not have_received(:new)
        end
      end
    end

    it 'updates permitted attributes of booking' do
      service.execute
      expect(booking.reload).to have_attributes(
        message: 'New message',
        flight: 'New flight',
        international_flag: true,
        fare_quote: 1234,
        vehicle: new_vehicle,
        vehicle_vendor: vehicle_vendor,
        scheduled_at: new_scheduled_at.to_datetime
      )
    end

    it 'updates addresses without need to reload booking explicitly' do
      service.execute
      expect(booking.pickup_address).to have_attributes(
        postal_code: 'NW11 9UA', lat: 51.5766877, lng: -0.2156368, line: 'Pickup', country_code: 'GB'
      )
      expect(booking.destination_address).to have_attributes(
        postal_code: 'HA8 6EY', lat: 51.6069082, lng: -0.2816665, line: 'Setdown', country_code: 'GB'
      )
    end

    it 'calculates travel distance' do
      expect{ service.execute }.to change{ booking.travel_distance }.from(10.0).to(20.0)
    end

    context 'as directed booking' do
      let(:booking) { create(:booking, :scheduled, vehicle: ot_vehicle, scheduled_at: scheduled_at, booker: admin, destination_address: false) }
      let(:params)  { super().merge(destination_address: nil) }

      it 'updates pickup_address' do
        service.execute
        booking.reload
        expect(booking.pickup_address).to have_attributes(
          postal_code: 'NW11 9UA', lat: 51.5766877, lng: -0.2156368, line: 'Pickup', country_code: 'GB'
        )
      end
    end

    context 'stop addresses' do
      let(:old_addresses) { create_list(:address, 3) }
      let(:new_address)   { create(:address) }

      before do
        3.times do |i|
          booking.add_booking_address(
            address_id: old_addresses[i].id,
            address_type: 'stop',
            stop_info: { name: "Stop #{i}", phone: "Stop #{i} Phone" }
          )
        end

        params[:stops] = [
          {
            name: 'Stop 1',
            phone: 'Stop 1 Phone',
            address: old_addresses[0].as_json(only: [:postal_code, :lat, :lng, :line, :country_code, :city]).with_indifferent_access
          },
          {
            name: 'Stop 2 New',
            phone: 'Stop 2 Phone New',
            address: new_address.as_json(only: [:postal_code, :lat, :lng, :line, :country_code, :city]).with_indifferent_access
          }
        ]
      end

      it 'updates changed stop address and deletes removed stop address' do
        service.execute
        booking.reload
        expect(booking.stop_addresses[0]).to have_attributes(
          old_addresses[0].as_json(only: [:postal_code, :lat, :lng, :line, :country_code, :city])
        )
        expect(booking.stop_addresses[1]).to have_attributes(
          new_address.as_json(only: [:postal_code, :lat, :lng, :line, :country_code, :city])
        )
        expect(booking.stop_addresses.count).to eq 2
      end
    end

    context 'when any booking address is one of passenger addresses' do
      let(:address)   { create(:address, params[:pickup_address]) }
      let(:passenger) { create(:passenger, company: admin.company) }
      let(:booking)   { create(:booking, :scheduled, passenger: passenger, scheduled_at: scheduled_at, booker: admin) }

      let(:params) { super().merge(passenger_id: passenger.id) }

      before { create(:passenger_address, passenger: passenger, address: address, type: 'home') }

      it 'saves passenger address type information with booking_address' do
        service.execute
        pickup_booking_address = service.booking.booking_addresses.find(&:pickup?)
        expect(pickup_booking_address.passenger_address_type).to eq('home')
      end
    end

    context 'when new scheduled_at less then 5 minutes' do
      let(:new_scheduled_at) { Time.current + 2.minutes }

      before { service.execute }

      it { is_expected.not_to be_success }

      it 'returns error' do
        expect(service.errors[:scheduled_at]).to include 'Pickup time should be greater than 30 minutes from now'
      end
    end

    context 'when users try updating a booking too close to scheduled time' do
      let(:scheduled_at) { 25.minutes.from_now }

      before { service.execute }

      it { is_expected.not_to be_success }

      its(:errors) { are_expected.to eq 'Booking can no longer be modified' }
    end

    context 'when new service_type is different from old service_type' do
      let(:booking) { create(:booking, :scheduled, :ot, booker: admin, ot_confirmation_number: 'AC11111', flight: 'EK5') }
      let(:old_booking) { Bookings::OldBooking.new('ot', booking.pickup_address, 'AC11111', 'service-id', 'service-id', 'EK5') }

      it 'calls Bookings.service_for for create and cancel' do
        expect(Bookings).to receive(:service_for)
          .with(booking, :create)
          .and_return(double(execute: true))

        expect(Bookings).to receive(:service_for)
          .with(old_booking, :cancel)
          .and_return(double(execute: true))

        expect(service.execute).to be_success
        expect(Faye.bookings).to have_received(:notify_update)
      end

      context 'when new booking service type is splyt' do
        let!(:new_vehicle) { create(:vehicle, :splyt, vehicle_vendor_pks: [vehicle_vendor.id]) }
        let(:params)       { super().merge(estimate_id: '1', region_id: '2') }

        before do
          stub_request(:post, 'https://localhost/splyt/v2/bookings')
            .and_return(status: 200, body: '{"service_id":"123"}', headers: {})
        end

        it 'updates estimate_id and region_id' do
          service.execute

          expect(booking.estimate_id).to eq('1')
          expect(booking.region_id).to eq('2')
        end

        context 'when status is order_received' do
          it 'updates vehicle' do
            service.execute

            expect(booking).to be_splyt
          end
        end
      end
    end

    context 'when new service_type is the same as old service_type' do
      let(:booking) { create(:booking, :scheduled, :gett, booker: admin, service_id: '12345') }

      it 'calls Bookings.service_for for modify' do
        expect(Bookings).to receive(:service_for)
          .with(booking, :modify)
          .and_return(double(execute: true))

        service.execute
        is_expected.to be_success
        expect(Faye.bookings).to have_received(:notify_update)
      end
    end

    context 'when new payment_type is card, old one is account' do
      let(:card) { create(:payment_card, :business, passenger_id: booking.passenger_id) }

      before do
        params[:payment_card_id] = card.id
        params[:payment_method] = 'business_payment_card'
      end

      it 'creates association between booking and card' do
        service.execute
        expect(booking.payment_card).to eq(card)
      end
    end

    context 'when new payment_type is account, old one is card' do
      let(:booking) do
        create(:booking, :scheduled, :gett,
          booker: admin,
          payment_method: 'business_payment_card',
          payment_card: create(:payment_card, :business)
        )
      end

      before { params[:payment_method] = 'account' }

      it 'removes association between booking and card' do
        service.execute
        expect(booking.payment_card).to eq(nil)
      end
    end

    context 'alerts' do
      let(:create_alert_service) { double('Alerts::Create') }

      context 'creates alert' do
        [:order_received, :location, :on_the_way, :arrived].each do |status|
          let(:booking) { create(:booking, :scheduled, status, scheduled_at: 2.hours.from_now) }

          it "creates alert for #{status} status" do
            expect(Alerts::Create).to receive(:new)
              .with(booking: booking, type: :order_changed)
              .and_return(create_alert_service)
            expect(create_alert_service).to receive(:execute)
            service.execute
          end
        end
      end

      context 'does not create alert' do
        [:creating, :processing, :in_progress].each do |status|
          let(:booking) { create(:booking, :scheduled, status, scheduled_at: 2.hours.from_now) }

          it "does not creates alert for #{status} status" do
            expect(Alerts::Create).not_to receive(:new)
              .with(booking: booking, type: :order_changed)
            expect(create_alert_service).not_to receive(:execute)
            service.execute
          end
        end
      end
    end

    context 'when booking is not modifiable' do
      let(:booking) { create(:booking) }

      before do
        allow(booking).to receive(:editable?).and_return(editable?)
        allow(booking).to receive(:editable_in_back_office?).and_return(editable_in_back_office?)
        service.execute
      end

      context 'edit in back office' do
        let(:editable?) { true }
        let(:editable_in_back_office?) { false }

        service_context{ { reincarnated: true } }

        it { is_expected.not_to be_success }

        its(:errors) { are_expected.to eq 'Booking can no longer be modified' }
      end

      context 'edit in front office' do
        let(:editable?) { false }
        let(:editable_in_back_office?) { true }

        service_context{ { reincarnated: false } }

        it { is_expected.not_to be_success }

        its(:errors) { are_expected.to eq 'Booking can no longer be modified' }
      end
    end

    context 'when booking has customer_care status' do
      context 'asap order' do
        let(:booking) { create(:booking, :customer_care, :asap) }

        it { expect{ service.execute }.to change(booking, :scheduled_at) }
      end

      context 'scheduled time in past' do
        let(:time)     { DateTime.current - 1.hour }
        let(:new_time) { DateTime.current }
        let(:booking)  { create(:booking, :customer_care, :asap, scheduled_at: time) }

        before do
          booking.set(asap: true)
          booking.save(validate: false)

          params[:scheduled_at] = DateTime.current - 2.hours
        end

        it { expect{ service.execute }.to change(booking, :scheduled_at).from(time).to(new_time) }
      end

      context 'scheduled time in future' do
        let(:time)    { DateTime.current + 5.days }
        let(:booking) { create(:booking, :customer_care, :scheduled) }

        before { params[:scheduled_at] = time }

        it { expect{ service.execute }.to change(booking, :scheduled_at).to(time) }
      end

      context 'when new scheduled_at is string' do
        let(:booking) { create(:booking, :customer_care, :scheduled) }
        let(:new_scheduled_at) { 1.day.from_now.to_s }

        before { service.execute }

        it { is_expected.to be_success }
      end
    end

    context 'when booking is recurring_next' do
      let(:booking) { create(:booking, :gett, :recurring) }

      before do
        params[:schedule] = 'schedule'
        expect(Shared::BookingSchedules::Save).to receive(:new)
          .with(schedule: booking.schedule, params: 'schedule', booking_params: params)
          .and_return(double(execute: true))

        service.execute
      end

      it { is_expected.to be_success }
    end
  end
end
