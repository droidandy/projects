require 'rails_helper'

RSpec.describe Users::ForgotPassword, type: :service do
  let!(:user) { create :user }

  subject(:service) { Users::ForgotPassword.new(email: email) }

  describe '#execute' do
    context 'with valid params' do
      let(:email) { user.email }

      it 'updates user' do
        expect{ service.execute }.to change{ user.reload.reset_password_token }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
      end

      it 'sends invitation' do
        expect{ service.execute }.to change(ActionMailer::Base.deliveries, :size).by(1)
      end

      context 'when user is a deactivated booker' do
        let!(:user) { create :booker, :inactive }

        it 'does not update user' do
          expect{ service.execute }.not_to change{ user.reload.reset_password_token }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.not_to be_success }
        end
      end

      context 'when email has different case' do
        let(:email) { user.email.upcase }
        before { service.execute }

        it { is_expected.to be_success }
      end
    end

    context 'with invalid email' do
      let(:email) { 'fake@mail.com' }

      it 'does not update user' do
        expect{ service.execute }.not_to change{ user.reload.reset_password_token }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
      end
    end
  end
end
