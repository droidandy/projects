require 'rails_helper'

RSpec.describe Admin::Companies::IndexPolicy, type: :policy do
  let(:user)   { create(:user, :customer_care) }
  let(:policy) { Admin::Companies::IndexPolicy.new(user, double('service')) }

  it 'allows execution' do
    expect(policy.execute?).to be true
  end

  describe 'manage_company?' do
    it 'delegates to Admin::Companies::Policy' do
      expect(Admin::Companies::Policy).to receive_message_chain(:new, :execute?).and_return(true)
      expect(policy.manage_company?).to be true
    end
  end

  describe 'toggle_company_status?' do
    it 'delegates to Admin::Companies::ToggleStatusPolicy' do
      expect(Admin::Companies::ToggleStatusPolicy).to receive_message_chain(:new, :execute?).and_return(true)
      expect(policy.toggle_company_status?).to be true
    end
  end
end
