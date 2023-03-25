require 'rails_helper'

RSpec.describe Admin::BaseController, type: :controller do
  controller do
    def index
      render json: { message: 'it works!' }
    end
  end

  describe '#index' do
    let(:token) { JsonWebToken.encode(id: user.id) }

    before do
      controller.request.headers['Authorization'] = "Bearer #{token}"
      get :index
    end

    context 'when authenticated user is a user' do
      let(:user) { create :user, :admin }

      it 'returns :ok status' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when authenticated user is a company member' do
      let(:user) { create :booker }

      it 'returns :unauthorized status' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
