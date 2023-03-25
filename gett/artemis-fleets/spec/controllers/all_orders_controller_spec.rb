describe AllOrdersController do
  let(:user) { create(:member) }
  let(:date) { '2017-08-8' }

  describe 'index' do
    it 'returns completed orders' do
      get :index, params: { token: token_for(user), from: date, to: date }
      expect(response.status).to eq 200
      expect(parsed_body).to be_an Array
    end
  end
end
