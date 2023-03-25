require 'rails_helper'

RSpec.describe Admin::Users::IndexPolicy, type: :policy do
  let(:user)   { create(:user, :customer_care) }
  let(:policy) { Admin::Users::IndexPolicy.new(user, double('service')) }

  it 'allows execution' do
    expect(policy.execute?).to be true
  end

  describe 'edit_gett_users?' do
    it 'delegates to Admin::Users::EditPolicy' do
      expect(Admin::Users::EditPolicy).to receive_message_chain(:new, :execute?).and_return(true)
      expect(policy.edit_gett_users?).to be true
    end
  end

  describe 'create_user?' do
    it 'delegates to Admin::Users::CreatePolicy' do
      expect(Admin::Users::CreatePolicy).to receive_message_chain(:new, :execute?).and_return(true)
      expect(policy.create_user?).to be true
    end
  end
end
