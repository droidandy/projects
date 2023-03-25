require 'rails_helper'

RSpec.describe Drivers::Stats::Parser do
  describe '#as_json' do
    let(:hash) do
      JSON.parse(json_body('gett/finance_portal_api/driver_stats'))
    end

    subject { described_class.new(hash).parse }

    it 'returns json' do
      expect(subject).to eq(
        completed_orders: 1,
        cancelled_orders: 2,
        cash_fare: 3.3,
        card_fare: 4.4,
        account_fare: 6.6,
        tips: 5.5
      )
    end
  end
end
