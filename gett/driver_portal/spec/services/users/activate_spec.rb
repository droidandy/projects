require 'rails_helper'

RSpec.describe Users::Activate do
  describe '#execute!' do
    let(:user) { create(:user, :with_driver_role, blocked_at: Time.current) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        user_id: user.id
      }
    end

    subject { described_class.new(current_user, params) }
    before(:each) { subject.execute! }

    it { expect(subject).to be_success }
    it { expect(user.reload).to be_active }

    context 'with invalid user id' do
      let(:params) {
        { user_id: 0 }
      }

      it { expect(subject).not_to be_success }
    end

    context 'when user already active' do
      let(:user) { create(:user, :with_driver_role) }

      it { expect(subject).not_to be_success }
      it { expect(subject.errors).to eq({ user: 'already activated' }) }
    end
  end
end
