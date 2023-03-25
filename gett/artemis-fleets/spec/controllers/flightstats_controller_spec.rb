RSpec.describe FlightstatsController, type: :controller do
  let(:user) { create(:member) }

  let(:params) do
    { flight: 'AB9',
      year:   2017,
      month:  4,
      day:    29,
      token: token_for(user)
    }
  end

  context 'success response' do
    let(:api_response) do
      double(:response, body: File.read('./spec/fixtures/flightstats/schedule_response.json'), code: 200)
    end

    before do
      expect(RestClient).to receive(:get).and_return(api_response)
    end

    it 'returns schedule for existing schedule' do
      get :schedule, params: params

      expect(response.status).to be_between(200, 204)
      expect(parsed_body).to include('carrier', 'flight')
    end
  end

  context 'failed response' do
    let(:api_response) do
      double(:response, body: '', code: 400)
    end

    before do
      expect(RestClient).to receive(:get).and_return(api_response)
    end

    it 'returns schedule for existing schedule' do
      get :schedule, params: params

      expect(response.status).to eq(404)
      expect(parsed_body).to be_falsey
    end
  end
end
