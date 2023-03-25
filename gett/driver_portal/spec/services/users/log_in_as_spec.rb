require 'rails_helper'

RSpec.describe Users::LogInAs do
  describe '#execute!' do
    let(:current_user) { create(:user, :with_site_admin_role) }
    let(:user) { create(:user, :with_driver_role) }

    let(:params) do
      {
        user_id: user.id
      }
    end

    subject { described_class.new(current_user, params) }
    before(:each) { subject.execute! }

    context 'existing user with accepted invite' do
      it 'create session' do
        expect(subject.success?).to be_truthy
        expect(subject.session).to be_truthy
        expect(subject.session.user_id).to eq(user.id)
      end
    end

    context 'unknown user' do
      let(:params) do
        {
          user_id: 0
        }
      end

      it 'returns nil instead of session' do
        expect(subject.success?).to be_falsey
        expect(subject.session).to be_nil
        expect(subject.errors).to eq({ user: 'not found' })
      end
    end
  end
end
