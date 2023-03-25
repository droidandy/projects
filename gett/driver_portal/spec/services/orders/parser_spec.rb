require 'rails_helper'

RSpec.describe Orders::Parser do
  describe '#as_json' do
    subject { described_class.new(hash).parse }

    let(:hash) do
      JSON.parse(json_body('gett/finance_portal_api/order'))
    end

    it 'returns valid data' do
      expect(subject).to eq(
        id: 14347135,
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
        dropoff: {
          full_address: '153 Great Portland Street, London, W1W 6QW',
          latitude: 51.520912,
          longitude: -0.143296
        },
        events: {
          scheduled_at: "2017-11-15T07:50:01+00:00",
          arrived_at: "2017-11-15T07:52:18+00:00",
          ended_at: "2017-11-15T08:43:02+00:00",
          cancelled_at: "2017-11-15T08:45:02+00:00"
        },
        distance: 6.4251,
        path: [
          {
            lat: 51.543362875193,
            lng: -0.062043146973017
          },
          {
            lat: 51.543373510907,
            lng: -0.062232141158385
          },
          {
            lat: 51.543313341332,
            lng: -0.062856718948874
          }
        ]
      )
    end
  end
end
