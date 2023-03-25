require 'rails_helper'

RSpec.describe Sessions::Create do
  describe '#execute!' do
    let(:password) { '123456789' }
    let!(:user) { create(:user, password: password, password_confirmation: password) }

    let(:session) do
      {
        email: user.email,
        password: password
      }
    end

    subject { described_class.new(session) }
    before(:each) { |example| subject.execute! unless example.metadata[:skip_before] }

    context 'existing user with accepted invite' do
      let!(:user) { create(:user, :with_accepted_invitation, password: password, password_confirmation: password) }

      it 'create session' do
        expect(subject.success?).to be_truthy
        expect(subject.session).to be_truthy
      end

      it 'create login entry', skip_before: true do
        expect{ subject.execute! }.to change{ user.logins.count }.by(1)
      end

      it 'invokes statistics recording', skip_before: true do
        expect_any_instance_of(Statistics::Record).to receive(:execute!)
          .and_return(true)
        subject.execute!
      end

      context 'with email in different case' do
        let(:session) do
          {
            email: user.email.upcase,
            password: password
          }
        end

        it 'create session' do
          expect(subject.success?).to be_truthy
          expect(subject.session).to be_truthy
        end
      end
    end

    context 'existing blocked user' do
      let!(:user) { create(:user, password: password, password_confirmation: password, blocked_at: Time.now) }

      it 'returns nil instead of session' do
        expect(subject.success?).to be_falsey
        expect(subject.session).to be_nil
        expect(subject.errors).to eq({ base: 'Your account is deactivated. Please contact us for details.' })
      end

      context 'when user is admin' do
        let!(:user) { create(:user, :with_site_admin_role, password: password, password_confirmation: password, blocked_at: Time.now) }

        it 'still returns nil instead of session' do
          expect(subject.success?).to be_falsey
          expect(subject.session).to be_nil
          expect(subject.errors).to eq({ base: 'Your account is deactivated. Please contact us for details.' })
        end
      end
    end

    context 'unknown user' do
      let(:session) do
        {
          email: 'abcd_test@fakemail.com',
          password: password
        }
      end

      it 'returns nil instead of session' do
        expect(subject.success?).to be_falsey
        expect(subject.session).to be_nil
        expect(subject.errors).to eq({ base: 'Your email/password combination is invalid. Please try again or click Forgot password to reset it.' })
      end
    end

    context 'empty params' do
      let(:session) do {} end

      it 'returns nil instead of session' do
        expect(subject.success?).to be_falsey
        expect(subject.session).to be_nil
      end
    end

    context 'user is onboarding agent' do
      let(:user) { create(:user, :with_onboarding_agent_role, password: password, password_confirmation: password) }

      it 'sets agent status to busy' do
        expect(subject).to be_success
        expect(subject.session).to be_present
        expect(user.reload.agent_status.status).to eq('busy')
      end
    end
  end
end
