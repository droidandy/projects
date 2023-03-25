require 'rails_helper'

RSpec.describe Passengers::Stats, type: :service do
  it { is_expected.to be_authorized_by(Passengers::ShowPolicy) }

  describe '#execute' do
    service_context { { member: passenger } }

    let(:passenger)   { create :passenger, first_name: 'John' }
    subject(:service) { Passengers::Stats.new(passenger: passenger) }

    describe 'delegates to Bookings::MonthlyStats service' do
      let(:dataset) { double :bookings_dataset }
      let(:stats_service) { double :service }

      before do
        expect(Bookings::MonthlyStats).to receive(:new)
          .with(dataset: Booking.where(passenger_id: passenger.id).completed, show_daily_spent: true)
          .and_return(stats_service)
        expect(stats_service).to receive_message_chain(:execute, :result).and_return('stats')
      end

      it 'includes results from booking stats service' do
        expect(service.execute.result).to eq 'stats'
      end
    end
  end
end
