require 'rails_helper'

RSpec.describe AuthenticatedController, type: :controller do
  controller do
    skip_before_action :authenticate, only: :new

    def index
      render json: { message: 'it works!' }
    end

    def new
      render json: { message: 'it works!' }
    end
  end

  describe '#index' do
    # with required authenticate action

    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(id: user.id) }

    context 'when request is not authorized' do
      it 'returns :unauthorized status' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end

      it 'does not get current_user' do
        get :index
        expect(controller.current_user).to be_nil
      end
    end

    context 'when request with token in Authorization header' do
      before do
        controller.request.headers['Authorization'] = "Bearer #{token}"
        get :index
      end

      context 'when token is correct' do
        it 'returns :ok status' do
          expect(response).to have_http_status(:ok)
        end

        it 'gets current_user' do
          expect(controller.current_user).to eq user.reload
        end
      end

      context 'when token is wrong' do
        let(:token) { JsonWebToken.encode(id: 1234567890) }

        it 'returns :unauthorized status' do
          expect(response).to have_http_status(:unauthorized)
        end

        it 'does not get current_user' do
          expect(controller.current_user).to be_nil
        end
      end
    end

    context 'when request with token in params' do
      before do
        get :index, params: { token: token }
      end

      context 'when token is correct' do
        it 'returns :ok status' do
          expect(response).to have_http_status(:ok)
        end

        it 'gets current_user' do
          expect(controller.current_user).to eq user.reload
        end

        context 'when current user is member' do
          let(:company) { create(:company, active: company_active?) }
          let(:user) { create(:member, company: company, active: user_active?) }
          let(:company_active?) { true }
          let(:user_active?) { true }

          specify { expect(response).to have_http_status(:ok) }
          specify { expect(controller.current_user.id).to eq user.id }
          specify { expect(controller.current_member.id).to eq user.id }

          context 'when user is deactivated' do
            let(:user_active?) { false }

            specify { expect(response).to have_http_status(:unauthorized) }
          end

          context 'when user company is deactivated' do
            let(:company_active?) { false }

            specify { expect(response).to have_http_status(:unauthorized) }
          end
        end
      end

      context 'when token is wrong' do
        let(:token) { JsonWebToken.encode(id: 1234567890) }

        it 'returns :unauthorized status' do
          expect(response).to have_http_status(:unauthorized)
        end

        it 'does not get current_user' do
          expect(controller.current_user).to be_nil
        end
      end
    end
  end

  describe '#new' do
    # with skipped authenticate action

    context 'when request is not authorized' do
      it 'returns :ok status' do
        get :new
        expect(response).to have_http_status(:ok)
      end

      it 'does not get current_user' do
        get :new
        expect(controller.current_user).to be_nil
      end
    end
  end
end
