RSpec.describe Admin::MessagesController do
  let(:admin) { create :administrator }

  describe 'create' do
    before do
      allow(Faye.messages).to receive(:notify_create_external)
    end

    it 'message when required params passed' do
      post :create, params: { token: token_for(admin), message: {body: 'something'} }
      expect(response.status).to eq(200)
    end

    it 'fail with empty body' do
      post :create, params: { token: token_for(admin), message: {body: nil} }
      expect(response.status).to eq(422)
    end
  end

  describe 'index' do
    let!(:message) { create(:message, sender: admin, company: nil, body: 'admin test') }

    it 'returns list' do
      get :index, params: { token: token_for(admin) }
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body).first).to include('body' => 'admin test')
    end
  end
end
