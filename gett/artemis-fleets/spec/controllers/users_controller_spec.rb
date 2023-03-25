describe UsersController do
  describe 'forgot_password' do
    let(:user) { create(:administrator) }

    it 'send a password reset token' do
      expect {
        put :forgot_password, params: {email: user.email}
      }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
  end

  describe 'reset_password' do
    let!(:user) { create(:administrator, reset_password_token: 't0k3n') }

    it 'resets a password if correct token is provided' do
      put :reset_password, params: {
        reset_password_token: 't0k3n',
        password: 'Secure_Password',
        password_confirmation: 'Secure_Password'
      }
      expect(response.status).to eq 200
      expect(parsed_body.keys).to eq %w(token realm)
      expect(user.reload.authenticate('Secure_Password')).to be_present
    end

    it 'returns error if the token is invalid' do
      put :reset_password, params: {
        reset_password_token: 'invalid',
        password: 'abc',
        password_confirmation: 'abc'
      }
      expect(response.status).to eq 422
      expect(parsed_body.keys).to eq %w(errors)
    end

    it 'returns error if password and confirmation do not match' do
      put :reset_password, params: {
        reset_password_token: 't0k3n',
        password: 'abc',
        password_confirmation: 'qwe'
      }
      expect(response.status).to eq 422
      expect(parsed_body.keys).to eq %w(errors)
    end
  end

  describe 'update password' do
    let(:user) { create(:administrator) }

    it 'updates password' do
      put :update_password, params: {
        token: token_for(user),
        current_password: 'Secure_Password',
        password: 'Secure-Password',
        password_confirmation: 'Secure-Password'
      }
      expect(response.status).to eq 200
      expect(user.reload.authenticate('Secure-Password')).to be_present
    end

    it 'returns error if current password is invalid' do
      put :update_password, params: {
        token: token_for(user),
        current_password: 'invalid',
        password: 'Secure-Password',
        password_confirmation: 'Secure-Password'
      }
      expect(response.status).to eq 422
      expect(user.reload.authenticate('Secure_Password')).to be_present
    end
  end

  describe 'check token' do
    it 'returns false if token is invalid' do
      get :check_token, params: {reset_password_token: 'invalid'}
      expect(response.status).to eq 404
      expect(parsed_body['valid']).to eq(false)
    end

    it 'returns true if token is' do
      create(:administrator, reset_password_token: 't0k3n')
      get :check_token, params: {reset_password_token: 't0k3n'}
      expect(response.status).to eq 200
      expect(parsed_body['valid']).to eq(true)
    end
  end
end
