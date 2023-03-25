require 'rails_helper'


RSpec.describe Invites::Update do
  subject { described_class.new(current_user, args) }

  let(:current_user) { create(:user, :with_driver_role, password: old_password, password_confirmation: old_password) }

  let(:args) do
    {
      token: token,
      password: password,
      password_confirmation: password_confirmation
    }
  end

  let(:old_password) { '123456789' }
  let(:password) { 'qwerty' }
  let(:password_confirmation) { 'qwerty' }
  let(:admin) { create(:user, :with_site_admin_role) }

  let(:creation_service) do
    service = Invites::Create.new(admin, user_id: current_user.id)
    service.execute!

    raise 'Something went wrong with token creation' unless service.success?

    service
  end

  let(:invite) { creation_service.invite }
  let(:token) { creation_service.token }

  describe '#execute!' do
    context 'when step is info' do
      before do
        invite.info_step!
      end

      it 'moves to password step' do
        subject.execute!
        expect(subject.invite.step).to eq('password')
      end

      it 'does not invoke statistics recording' do
        expect_any_instance_of(Statistics::Record).not_to receive(:execute!)
          .and_return(true)
        subject.execute!
      end
    end

    context 'when step is password' do
      before do
        invite.password_step!
      end

      it 'moves to brief step' do
        subject.execute!
        expect(subject.invite.step).to eq('brief')
      end

      it 'updates password for the user' do
        subject.execute!
        expect(subject.user.authenticate(password)).to eq(subject.user)
      end

      context 'when password is nil' do
        let(:password) { nil }

        it 'fails with error' do
          subject.execute!
          expect(subject.errors[:password]).to be_present
        end
      end

      context 'when password confirmation is nil' do
        let(:password_confirmation) { nil }

        it 'fails with error' do
          subject.execute!
          expect(subject.errors[:password_confirmation]).to be_present
        end
      end

      context 'when password confirmation is not match password' do
        let(:password_confirmation) { 'foobar' }

        it 'fails with error' do
          subject.execute!
          expect(subject.errors[:password_confirmation]).to be_present
        end
      end

      context 'when user is admin' do
        let(:current_user) { create(:user, :with_driver_support_role, password: old_password, password_confirmation: old_password) }

        it 'make invite accepted' do
          subject.execute!
          expect(subject.invite.step).to eq('accepted')
        end
      end

      context 'when user is apollo driver' do
        let(:current_user) do
          create(:user, :with_apollo_driver_role,
                 password: old_password,
                 password_confirmation: old_password
                )
        end

        it 'make invite accepted' do
          subject.execute!
          expect(subject.invite.step).to eq('accepted')
        end
      end

      it 'does not invoke statistics recording' do
        expect_any_instance_of(Statistics::Record).not_to receive(:execute!)
          .and_return(true)
        subject.execute!
      end
    end

    context 'when step is brief' do
      before do
        invite.brief_step!
      end

      it 'moves to accepted step' do
        subject.execute!
        expect(subject.invite.step).to eq('accepted')
      end

      it 'creates session' do
        subject.execute!
        expect(subject.session.user.id).to eq(current_user.id)
      end

      it 'updates accepted_at' do
        subject.execute!
        expect(subject.invite.accepted_at).to be_present
      end

      it 'invokes statistics recording' do
        expect_any_instance_of(Statistics::Record).to receive(:execute!)
          .and_return(true)
        subject.execute!
      end
    end

    context 'when invite is expired' do
      before do
        invite.update!(expires_at: Time.current)
      end

      it 'returns error about token' do
        subject.execute!
        expect(subject.errors[:token]).to be_present
      end
    end

    context 'when invite is already accepted' do
      before do
        invite.update!(accepted_at: Time.current)
      end

      it 'returns error about token' do
        subject.execute!
        expect(subject.errors[:token]).to be_present
      end
    end

    context 'when invite belongs to other user' do
      let(:other_user) { create(:user) }

      before do
        invite.update!(user: other_user)
      end

      it 'returns error about token' do
        subject.execute!
        expect(subject.errors[:token]).to be_present
      end
    end

    context 'when token is invalid' do
      let(:token) { 'foobar' }

      it 'returns error about token' do
        subject.execute!
        expect(subject.errors[:token]).to be_present
      end
    end
  end
end
