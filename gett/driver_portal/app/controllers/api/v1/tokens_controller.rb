module Api
  module V1
    class TokensController < ApplicationController
      def create
        service = ::Users::Tokens::Create.new(create_params)

        execute_and_process(service) do
          render json: { token: service.token }
        end
      end

      def exchange
        service = ::Users::Tokens::Exchange.new(exchange_params)

        execute_and_process(service) do
          render json: Sessions::Show.new(service.session).as_json
        end
      end

      private def create_params
        {
          driver_id: params[:driver_id]
        }
      end

      private def exchange_params
        {
          token: params[:token]
        }
      end
    end
  end
end
