require 'rails_helper'

RSpec.describe Admin::Users::FormPolicy, type: :policy do
  let(:user)   { create(:user, :admin) }
  let(:policy) { Admin::Users::FormPolicy.new(user, service) }
  let(:service) { double('service') }

  it 'allows execution' do
    expect(policy.execute?).to be true
  end

  describe 'execute?' do
    it 'delegates to Admin::Users::Policy' do
      expect(Admin::Users::Policy).to receive_message_chain(:new, :execute?).and_return(true)
      expect(policy.execute?).to be true
    end
  end

  describe 'change_user_role?' do
    it 'allows superadmin to change roles of admins' do
      expect(service).to receive_message_chain(:admin, :user_role_name, :admin?).and_return(false)
      expect(policy.change_user_role?).to be true
    end

    context 'when current user is `admin` and user_being_edited is `superadmin`' do
      it 'does not allow to change roles' do
        expect(service).to receive_message_chain(:admin, :user_role_name, :admin?).and_return(true)
        expect(service).to receive_message_chain(:user, :user_role_name, :superadmin?).and_return(true)
        expect(policy.change_user_role?).to be false
      end
    end
  end
end
