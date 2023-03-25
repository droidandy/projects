require 'rails_helper'

RSpec.describe Bookings::FlightValidator do
  subject(:service) { described_class.new(booking: booking) }

  describe 'execution errors' do
    subject { service.execute.errors[:flight] }

    let(:flights_service) { double(:flights_service, result: flights) }
    let(:flight)  { 'W95957' }
    let(:flights) { [{departure: {code: 'LHR'}, arrival: {code: 'DUB'}}] }

    before do
      Timecop.freeze('2017-04-29 12:00:00')

      allow(Flightstats::Flights).to receive(:new)
        .with(flight: flight, year: 2017, month: 4, day: 29)
        .and_return(flights_service)
      allow(flights_service).to receive(:execute).and_return(flights_service)

      allow(I18n).to receive(:t){ |msg| msg[/[^.]+$/] }
    end

    after { Timecop.return }

    describe 'flight not_found error' do
      context 'when flight is not present' do
        let(:booking) { create(:booking) }

        it { is_expected.not_to include('not_found') }
      end

      context 'when flight is present' do
        let(:booking) { create(:booking, flight: flight) }

        context 'and found via flightstats' do
          it { is_expected.not_to include('not_found') }
        end

        context 'and not found via flightstats' do
          let(:flights) { [] }

          it { is_expected.to include('not_found') }
        end
      end
    end

    describe 'flight not_match error' do
      let(:verifiable_provider?) { true }
      let(:departure_airport)    { create(:airport, iata: 'LHR') }
      let(:arrival_airport)      { create(:airport, iata: 'DUB') }

      before { allow(service).to receive(:verifiable_provider?).and_return(verifiable_provider?) }

      context 'when flight is present, it is valid, booking is verifiable airport ride' do
        context 'when pickup_address is where flight arrives' do
          let(:address) { create(:address, airport: arrival_airport) }
          let(:booking) { create(:booking, flight: flight, pickup_address: address) }

          it { is_expected.not_to include('not_match') }
        end

        context 'when pickup_address is where flight departures from' do
          let(:address) { create(:address, airport: departure_airport) }
          let(:booking) { create(:booking, flight: flight, pickup_address: address) }

          it { is_expected.to include('not_match') }
        end

        context 'when destination_address is where flight departures from' do
          let(:address) { create(:address, airport: departure_airport) }
          let(:booking) { create(:booking, flight: flight, destination_address: address) }

          it { is_expected.not_to include('not_match') }
        end

        context 'when destination_address is where flight arrives' do
          let(:address) { create(:address, airport: arrival_airport) }
          let(:booking) { create(:booking, flight: flight, destination_address: address) }

          it { is_expected.to include('not_match') }
        end
      end

      context 'when not airport ride' do
        let(:booking) { create(:booking, flight: flight) }

        it { is_expected.not_to include('not_match') }
      end

      context 'when not verifiable_provider' do
        let(:verifiable_provider?) { false }
        let(:address) { create(:address, airport: departure_airport) }
        let(:booking) { create(:booking, flight: flight, pickup_address: address) }

        it { is_expected.not_to include('not_match') }
      end

      context 'when flight number is not valid' do
        let(:flights) { [] }
        let(:address) { create(:address, airport: departure_airport) }
        let(:booking) { create(:booking, flight: flight, pickup_address: address) }

        it { is_expected.not_to include('not_match') }
      end

      context 'when flight number is blank' do
        let(:flight)  { nil }
        let(:address) { create(:address, airport: departure_airport) }
        let(:booking) { create(:booking, flight: flight, pickup_address: address) }

        it { is_expected.not_to include('not_match') }
      end
    end

    describe 'flight required error' do
      let(:verifiable_provider?) { true }
      let(:airport) { create(:airport, iata: 'DUB') }
      let(:address) { create(:address, airport: airport) }
      let(:booking) { create(:booking, flight: flight, pickup_address: address) }

      before { allow(service).to receive(:verifiable_provider?).and_return(verifiable_provider?) }

      context 'when flight is blank for verifiable provider with airport ride' do
        let(:flight) { nil }

        it { is_expected.to include('required') }
      end

      context 'when flight is present' do
        it { is_expected.not_to include('required') }
      end

      context 'when provider is not verifiable' do
        let(:flight) { nil }
        let(:verifiable_provider?) { false }

        it { is_expected.not_to include('required') }
      end

      context 'when not airport ride' do
        let(:flight)  { nil }
        let(:address) { create(:address, :baker_street) }

        it { is_expected.not_to include('required') }
      end
    end

    describe 'flight check in booking local time zone' do
      let(:address) { create(:address, timezone: 'America/Chicago') }
      let(:booking) { create(:booking, flight: flight, scheduled_at: '2017-04-30 02:00:00', pickup_address: address) }

      it "checks for flight in booking's local day" do
        service.execute
        expect(Flightstats::Flights).to have_received(:new).with(flight: flight, year: 2017, month: 4, day: 29)
      end
    end
  end

  describe '#verifiable_provider?' do
    subject { service.send(:verifiable_provider?) }

    context 'when booking is carey' do
      let(:booking) { create(:booking, :carey) }

      it { is_expected.to be true }
    end

    context 'when booking is splyt' do
      let(:booking) { create(:booking, :splyt) }

      it { is_expected.to be true }
    end

    context 'when booking is neither carey nor splyt' do
      let(:booking) { create(:booking, :ot) }

      it { is_expected.to be false }
    end
  end
end
