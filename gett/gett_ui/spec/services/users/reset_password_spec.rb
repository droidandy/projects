require 'rails_helper'

RSpec.describe Users::ResetPassword, type: :service do
  let!(:user) { create :user, :with_password_reset }

  subject(:service) { Users::ResetPassword.new(params: params) }

  describe '#execute' do
    context 'with valid params' do
      let(:params) { { reset_password_token: user.reset_password_token, password: '12345678', password_confirmation: '12345678' } }

      it 'updates user' do
        expect{ service.execute }.to change{ user.reload.password_digest }
      end

      it 'resets reset_password_token' do
        expect{ service.execute }.to change{ user.reload.reset_password_token }.to(nil)
      end

      it 'resets reset_password_sent_at' do
        expect{ service.execute }.to change{ user.reload.reset_password_sent_at }.to(nil)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid confirmation' do
      let(:params) { { reset_password_token: user.reset_password_token, password: '12345678', password_confirmation: '1234' } }

      it 'does not update user' do
        expect{ service.execute }.not_to change{ user.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'with invalid token' do
      let(:params) { { reset_password_token: 'invalid_token', password: '12345678', password_confirmation: '12345678' } }

      it 'does not update user' do
        expect{ service.execute }.not_to change{ user.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'with nil token' do
      let!(:user_without_password_reset) { create :user }
      let(:params) { { reset_password_token: nil, password: '12345678', password_confirmation: '12345678' } }

      it 'does not return any user with nil password reset token' do
        service.execute
        expect(service.user).to be_nil
      end

      it 'does not update user with nil password reset token' do
        expect { service.execute }.not_to change { user_without_password_reset.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
