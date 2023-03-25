describe DriverReportsController do
  let(:user) { create(:member) }

  it 'returns report for current week' do
    get :index, params: { token: token_for(user), week: 'current' }
    expect(response.status).to eq 200
    expect(parsed_body).to be_an Array
  end

  it 'returns report for previous week' do
    get :index, params: { token: token_for(user), week: 'previous' }
    expect(response.status).to eq 200
    expect(parsed_body).to be_an Array
  end
end
