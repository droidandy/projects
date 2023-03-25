require 'rails_helper'

RSpec.describe ApplicationController, type: :controller do
  controller do
    def index
      fail ApplicationService::NotAuthorizedError
    end

    def show
      render json: {}
    end
  end

  describe 'catching 401 errors' do
    it 'returns :unauthorized status' do
      get :index
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'member authorization' do
    before { routes.draw { get 'show' => 'anonymous#show' } }

    context 'when current_user is present but current_member is blank' do
      before do
        allow(controller).to receive(:current_user).and_return(user)
        allow(controller).to receive(:current_member).and_return(nil)
      end

      context 'because current_user is not a member (BO user using FO endpoints, i.e. /documents)' do
        let(:user) { create(:user, :admin) }

        it 'authorizes user' do
          get :show
          expect(response).to have_http_status(:success)
        end
      end

      context 'because current_member is inactive' do
        let(:user) { create(:passenger) }

        it 'returns :unauthorized status' do
          get :show
          expect(response).to have_http_status(:unauthorized)
        end
      end
    end
  end
end
