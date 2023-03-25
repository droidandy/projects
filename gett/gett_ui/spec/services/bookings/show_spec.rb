require 'rails_helper'

RSpec.describe Bookings::Show, type: :service do
  it { is_expected.to be_authorized_by(Bookings::ShowPolicy) }

  let(:member) { create(:member) }

  describe '#execute' do
    service_context { { member: member, company: member.company, sanitize_home_address: true, front_office: true } }

    let(:booking) { create(:booking, booker: member) }
    let(:service) { Bookings::Show.new(booking: booking) }

    before do
      allow_any_instance_of(Address).to receive(:[]).and_call_original
      allow_any_instance_of(Address).to receive(:[]).with(:passenger_address_type).and_return('home')
    end

    subject { service.execute.result.with_indifferent_access }

    it {
      is_expected.to include(
        :id, :service_id, :message, :flight, :status, :payment_method, :scheduled_at,
        :service_type, :message_to_driver, :passenger, :passenger_avatar_url, :phone,
        :pickup_address, :destination_address, :stop_addresses, :vehicle_type, :booker,
        :travel_reason, :references, :channel, :final, :driver_details, :can, :path, :events,
        :booker_phone, :travel_distance, :rateable, :recurring_next, :cancellation_reasons,
        :rating_reasons
      )
    }
    its([:can]) { is_expected.to include :cancel, :edit }

    it { is_expected.not_to include :total_cost }

    context 'when booking is completed' do
      let(:booking) { create(:booking, status: :completed, booker: member) }

      it { is_expected.to include :total_cost }
    end

    describe '[:driver_details]' do
      let!(:driver) { create :booking_driver, booking: booking, name: 'Имя', lat: 1, lng: 2, rating: 3, phone_number: '12345678', phv_license: '987654321' }

      its([:driver_details]) do
        is_expected.to include(
          'info' => {
            'name'         => 'Imya',
            'rating'       => 3,
            'phv_license'  => '987654321',
            'vehicle'      => {},
            'image_url'    => nil,
            'phone_number' => '12345678'
          },
          'location' => {'lat' => 1.0, 'lng' => 2.0},
          'distance' => {},
          'pickup_distance' => 0
        )
      end

      context 'when eta is negative' do
        let!(:driver) { create :booking_driver, booking: booking, name: 'some name', lat: 1, lng: 2, eta: -30 }

        its([:driver_details]) { is_expected.to include(eta: '< 1') }
      end

      context 'when eta is positive' do
        let!(:driver) { create :booking_driver, booking: booking, name: 'some name', lat: 1, lng: 2, eta: 10 }

        its([:driver_details]) { is_expected.to include(eta: '10') }
      end

      context 'when driver info is blank' do
        let!(:driver) { create :booking_driver, booking: booking, name: nil, vehicle: {}, phone_number: nil }

        its([:driver_details]) { is_expected.to match(info: { vehicle: {} }) }
      end
    end

    describe '[:cancellation_reasons]' do
      let(:reasons_list) { %w(mistaken_order driver_asked_to hailed_another_car too_long_eta) }

      its([:cancellation_reasons]) { is_expected.to match_array reasons_list }
    end

    describe '[:rating_reasons]' do
      let(:reasons_list) do
        %w(
          driver_professionalism
          vehicle_condition
          driving_style
          car_model
          pickup
          route
          app
          traffic
        )
      end

      its([:rating_reasons]) { is_expected.to match_array reasons_list }
    end

    describe '[:pickup_address, :line]' do
      its([:pickup_address, :line]) { is_expected.to eq HomePrivacy::HOME }

      context 'member is a passenger' do
        let(:booking) { create(:booking, passenger: member) }

        its([:pickup_address, :line]) { is_expected.to eq booking.pickup_address.line }
      end
    end
  end
end
