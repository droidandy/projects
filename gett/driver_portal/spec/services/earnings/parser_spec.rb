require 'rails_helper'

RSpec.describe Earnings::Parser do
  describe '#as_json' do
    subject { described_class.new(hash).parse }

    context 'with full data' do
      let(:hash) do
        JSON.parse(json_body('gett/earnings_api/earnings'))['transactions'].second
      end

      it 'parses data successfully' do
        expect(subject).to be_present
      end

      it 'returns valid data' do
        expect(subject).to eq(
          external_id: "2249477303",
          destination: {
            full_address: "Overland House, 151-153 Great Portland Street, London, W1W 6QW",
            latitude: 51.520896,
            longitude: -0.143318
          },
          origin: {
            full_address: "216 Richmond Road, London, E8",
            latitude: 51.543267,
            longitude: -0.061942
          },
          taxi_fare: 21.85,
          gratuity: 1.2,
          commission: -2.62,
          extras: 7.23,
          peak_hour_premium: 2.0,
          total: 31.66,
          vat: 0.43,
          cancellation_fee: 0.0,
          waiting: 2.1,
          order_id: 14347135,
          started_at: '2017-11-15T07:58:18+00:00',
          journey_time: 2684,
          status: 'completed',
          issued_at: '2017-11-15T07:50:01+00:00',
          transaction_type: {
            name: 'Ride',
            slug: 'bookkeeping_order'
          }
        )
      end
    end

    context 'with partial data' do
      let(:hash) do
        JSON.parse(json_body('gett/earnings_api/earnings'))['transactions'].first
      end

      it 'parses data successfully' do
        expect(subject).to be_present
      end
    end
  end
end
