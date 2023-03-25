module Api
  module V1
    class TestController < Api::ApiController
      def test
        render json: { test: Gett::Core::VERSION }, status: :ok
      end
    end
  end
end
