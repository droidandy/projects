require 'rails_helper'

RSpec.describe Admin::Members::Stats, type: :service do
  it { is_expected.to be_authorized_by(Admin::Policy) }

  describe '#execute' do
    service_context { { member: member } }

    let(:member) { create :booker, first_name: 'John' }

    subject(:service) { Admin::Members::Stats.new(member: member) }

    describe 'delegates to Bookings::MonthlyStats service' do
      let(:dataset) { double :bookings_dataset }
      let(:stats_service) { double :service }

      before do
        expect(Bookings::MonthlyStats).to receive(:new)
          .with(dataset: Booking.where(passenger_id: member.id).completed, show_daily_spent: true)
          .and_return(stats_service)
        expect(stats_service).to receive_message_chain(:execute, :result).and_return('stats')
      end

      it 'includes results from booking stats service' do
        expect(service.execute.result).to eq 'stats'
      end
    end
  end
end
