describe FutureOrdersController do
  let(:user) { create(:member) }

  it 'returns future orders' do
    get :index, params: { token: token_for(user) }
    expect(response.status).to eq 200
    expect(parsed_body).to be_an Array
  end
end
