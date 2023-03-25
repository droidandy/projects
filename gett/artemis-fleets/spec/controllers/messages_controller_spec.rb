RSpec.describe MessagesController do
  let(:company) { create :company }
  let(:user)   { create :member, company: company }

  describe 'mark_all_as_read' do
    it 'silently mark messages' do
      put :mark_all_as_read, params: { token: token_for(user) }
      expect(response.status).to eq(200)
    end
  end

  describe 'unread' do
    let!(:message) { create(:message, company: company, sender: user, body: 'abc123') }

    it 'returns list' do
      get :unread, params: { token: token_for(user) }
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body).first).to include('body' => 'abc123')
    end
  end

  describe 'create' do
    before do
      allow(Faye.messages).to receive(:notify_create_internal)
    end

    it 'message when required params passed' do
      post :create, params: { token: token_for(user), message: {body: 'something'} }
      expect(response.status).to eq(200)
    end

    it 'fail with empty body' do
      post :create, params: { token: token_for(user), message: {body: nil} }
      expect(response.status).to eq(422)
    end
  end
end
