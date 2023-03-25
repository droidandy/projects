describe MembersController do
  let(:user) { create(:member) }

  describe 'index' do
    before { create(:member, company: user.company) }

    context 'admin user' do
      let(:user) { create(:member, role: 'admin') }

      it 'returns list of company members' do
        get :index, params: { token: token_for(user) }
        expect(response.status).to eq(200)
        expect(parsed_body.length).to eq(2)
      end
    end

    context 'basic user' do
      let(:user) { create(:member, role: 'user') }

      it 'returns only current user' do
        get :index, params: { token: token_for(user) }
        expect(response.status).to eq(200)
        expect(parsed_body.length).to eq(1)
        expect(parsed_body.first['id']).to eq(user.id)
      end
    end
  end

  describe 'create' do
    it 'creates a new member' do
      expect {
        post :create, params: {
          token: token_for(user),
          member: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@doe.com',
            phone: '123',
            mobile: '321',
            role: 'user'
          }
        }
      }.to change { ActionMailer::Base.deliveries.count }.by(1)

      expect(response.status).to eq(200)
      member = Member.last
      expect(member.email).to eq('john@doe.com')
      expect(member.role).to eq('user')
      expect(member.reset_password_token).to be_present
    end
  end

  describe 'update' do
    it 'updates a member' do
      put :update, params: {
        token: token_for(user),
        id: user.id,
        member: {
          role: 'user'
        }
      }

      expect(response.status).to eq(200)
      user.reload
      expect(user.role).to eq('user')
    end
  end

  describe 'destroy' do
    it 'deletes a member' do
      delete :destroy, params: {
        token: token_for(user),
        id: user.id
      }

      expect(response.status).to eq(200)
      expect(Member.exists?(user.id)).to eq(false)
    end
  end
end
