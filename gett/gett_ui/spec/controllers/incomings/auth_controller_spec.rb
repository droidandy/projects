require 'rails_helper'

RSpec.describe Incomings::AuthController do
  controller do
    def index
      render json: { message: 'it works!' }
    end

    private def access_token
      'AccessToken'
    end
  end

  describe '#index' do
    let(:token) { 'AccessToken' }

    context 'when request is not authorized' do
      it 'returns :unauthorized status' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when request with token in Authorization header' do
      before do
        request.headers['Authorization'] = token
        get :index
      end

      context 'when token is correct' do
        it 'returns :ok status' do
          expect(response).to have_http_status(:ok)
        end
      end

      context 'when token is wrong' do
        let(:token) { 'some_auth_token' }

        it 'returns :unauthorized status' do
          expect(response).to have_http_status(:unauthorized)
        end
      end
    end
  end
end
