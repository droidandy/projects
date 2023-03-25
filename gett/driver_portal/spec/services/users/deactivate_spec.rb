require 'rails_helper'

RSpec.describe Users::Deactivate do
  describe '#execute!' do
    let(:user) { create(:user, :with_driver_role) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        user_id: user.id
      }
    end

    subject { described_class.new(current_user, params) }
    before(:each) { subject.execute! }

    it 'should run successfully' do
      expect(subject).to be_success
    end

    it { expect(user.reload).not_to be_active }

    context 'with invalid user id' do
      let(:params) do
        { user_id: 0 }
      end

      it { expect(subject).not_to be_success }
    end

    context 'when user already blocked' do
      let(:user) { create(:user, :with_driver_role, :blocked) }

      it { expect(subject).not_to be_success }
      it { expect(subject.errors).to eq({ user: 'already blocked' }) }
    end
  end
end
