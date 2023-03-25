require 'rails_helper'

RSpec.describe Bookings::FormProcessors::General, type: :service do
  subject(:service) { described_class.new(booking_params: booking_params) }

  let(:booking_params) { {} }

  describe '#execute' do
    it 'returns empty results hash' do
      expect(service.execute.result).to eq(booking_params: {}, alerts: {}, errors: {}, metadata: {})
    end

    context 'when :flight is present in booking_params' do
      let(:booking_params) do
        {
          flight:              'EK5',
          pickup_address:      {airport: 'DUB'},
          stops:               [address: {airport: 'LHR'}],
          destination_address: {airport: 'JFK'}
        }
      end
      let(:flight_info_service) { double }

      before do
        expect(Bookings::FlightInfo).to receive(:new)
          .with(
            flight:           'EK5',
            scheduled_at:     instance_of(ActiveSupport::TimeWithZone),
            pickup_iata:      ['DUB', 'LHR'],
            destination_iata: 'JFK'
          )
          .and_return(flight_info_service)

        allow(flight_info_service).to receive_message_chain(:execute, :result)
          .and_return(flight_info_result)

        service.execute
      end

      context 'when FlightInfo service finds all related information' do
        let(:flight_info_result) { {'DUB' => 'DUB info'} }

        it "doesn't add errors to result" do
          expect(service.result[:errors]).not_to include(:flight)
        end
      end

      context 'when FlightInfo service fails to find matched flight info' do
        let(:flight_info_result) { {'DUB' => nil} }

        it "adds errors to result" do
          expect(service.result.dig(:errors, :flight)).to be_present
        end
      end
    end
  end
end
