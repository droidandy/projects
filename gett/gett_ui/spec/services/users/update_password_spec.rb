require 'rails_helper'

RSpec.describe Users::ResetPassword, type: :service do
  let!(:user) { create :user, password: '123123123', password_confirmation: '123123123' }

  subject(:service) { Users::UpdatePassword.new(params: params) }

  service_context { { user: user } }

  describe '#execute' do
    context 'with valid params' do
      let(:params) { { current_password: '123123123', password: '12345678', password_confirmation: '12345678' } }

      it 'updates user' do
        expect{ service.execute }.to change{ user.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid confirmation' do
      let(:params) { { current_password: '123123', password: '12345678', password_confirmation: '1234' } }

      it 'does not update user' do
        expect{ service.execute }.not_to change{ user.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end

    context 'with invalid current password' do
      let(:params) { { current_password: '321321321', password: '12345678', password_confirmation: '12345678' } }

      it 'does not update user' do
        expect{ service.execute }.not_to change{ user.reload.password_digest }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end

      context 'when reincarnated is true' do
        service_context { { user: user, reincarnated: true } }

        before { allow(user).to receive(:valid_password?).and_return(false) }

        it 'updates user' do
          expect{ service.execute }.to change{ user.reload.password_digest }
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:errors) { is_expected.to be_empty }
        end
      end
    end
  end
end
