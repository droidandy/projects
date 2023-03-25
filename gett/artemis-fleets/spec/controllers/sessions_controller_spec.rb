describe SessionsController do
  let(:user) { create(:member) }

  describe 'create' do
    it 'logs the user in with correct credentials' do
      post :create, params: {user: {email: user.email, password: 'Secure_Password'}}
      expect(response.status).to eq 200
      expect(parsed_body.keys).to eq %w(token realm)
    end

    it 'does not log in an inactive user' do
      user.update!(active: false)
      post :create, params: {user: {email: user.email, password: 'Secure_Password'}}
      expect(response.status).to eq 401
    end
  end

  describe 'current' do
    it 'returns information about current user' do
      get :current, params: { token: token_for(user) }
      expect(response.status).to eq 200
    end

    it 'does not return information if user is inactive' do
      user.update!(active: false)
      get :current, params: { token: token_for(user) }
      expect(response.status).to eq 401
    end
  end
end
