require 'rails_helper'

RSpec.describe Bookers::Show, type: :service do
  it { is_expected.to be_authorized_by(Bookers::ShowPolicy) }

  describe '#execute' do
    let(:booker)  { create :booker }
    let(:service) { Bookers::Show.new(booker: booker) }

    subject { service.execute.result.with_indifferent_access }

    its([:record]) do
      is_expected.to include(
        :id, :email, :first_name, :last_name, :phone, :mobile, :active, :work_role_id,
        :department_id, :role_name, :role_type, :passenger_pks
      )
    end

    describe ':stats' do
      let(:dataset) { double :bookings_dataset }
      let(:stats_service) { double :service }

      before do
        expect(Bookings::MonthlyStats).to receive(:new)
          .with(dataset: Booking.where(booker_id: booker.id).completed, show_daily_spent: true)
          .and_return(stats_service)
        expect(stats_service).to receive_message_chain(:execute, :result).and_return('stats')
      end

      it 'includes results from booking stats service' do
        expect(service.execute.result).to include stats: 'stats'
      end
    end
  end
end
