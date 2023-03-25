describe CompletedOrdersController do
  let(:user) { create(:member) }

  describe 'index' do
    it 'returns completed orders' do
      get :index, params: { token: token_for(user) }
      expect(response.status).to eq 200
      expect(parsed_body).to be_an Array
      expect(parsed_body.first.keys).to_not include('path_points')
    end
  end

  describe 'show' do
    before do
      CompletedOrdersRequest.new(user.company.fleet_id).execute
    end

    it 'returns path points of an order' do
      get :show, params: { token: token_for(user), id: CompletedOrder.last.order_id }
      expect(parsed_body.keys).to eq %w(order_id path_points)
    end

    it 'returns not found if order does not exist' do
      get :show, params: { token: token_for(user), id: 0 }
      expect(response.status).to eq 404
    end
  end
end
