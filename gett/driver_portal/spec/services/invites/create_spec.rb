require 'rails_helper'

RSpec.describe Invites::Create do
  subject { described_class.new(current_user, args) }

  let(:current_user) { create(:user, :with_site_admin_role) }

  let(:args) do
    {
      user_id: user_id
    }
  end

  let(:user) { create(:user, :with_driver_role) }
  let(:user_id) { user.id }

  describe 'execute!' do
    it 'creates new invite' do
      expect { subject.execute! }.to change { Invite.count }.by(1)
    end

    it 'creates invite with valid step' do
      subject.execute!
      expect(subject.invite.step).to eq('info')
    end

    it 'saves sender of invite' do
      subject.execute!
      expect(subject.invite.sender).to eq(current_user)
    end

    it 'sends email to the user' do
      expect { subject.execute! }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    context 'when previous invites for the same user already exists' do
      let!(:previous_invite) { create(:invite, user: user) }

      it 'makes them expired' do
        subject.execute!
        expect(previous_invite.reload.expired?).to be true
      end
    end

    context 'when current user is not an admin' do
      let(:current_user) { create(:user) }

      it 'raises an error' do
        expect { subject.execute! }.to raise_error(Pundit::NotAuthorizedError)
      end
    end

    context 'when previous expired invites for the same user already exists' do
      let!(:previous_invite) { create(:invite, expires_at: Time.current - 7.days, user: user) }

      it 'does not update expires_at for them' do
        expires_at = previous_invite.reload.expires_at
        subject.execute!
        expect(previous_invite.reload.expires_at).to eq(expires_at)
      end
    end

    context 'when previous invites for the other user already exists' do
      let(:other_user) { create(:user) }
      let!(:previous_invite) { create(:invite, user: other_user) }

      it 'does not touch them' do
        subject.execute!
        expect(previous_invite.reload.expired?).to be false
      end
    end

    context 'when target user is admin' do
      let(:user) { create(:user, :with_site_admin_role) }

      it 'should have password step by default' do
        subject.execute!
        expect(subject.invite.step).to eq('password')
      end
    end

    context 'when target is apollo driver' do
      let(:user) { create(:user, :with_apollo_driver_role) }

      it 'should have password step by default' do
        subject.execute!
        expect(subject.invite.step).to eq('password')
      end
    end
  end
end
