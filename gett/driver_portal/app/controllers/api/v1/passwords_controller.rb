module Api
  module V1
    class PasswordsController < ApplicationController
      def create
        service = Passwords::Reset.new(create_params)

        execute_and_process(service)
      end

      def update
        service = Passwords::Update.new(update_params)

        execute_and_process(service) do
          render json: Sessions::Show.new(service.session).as_json
        end
      end

      def create_params
        {
          email: params[:email]
        }
      end

      def update_params
        {
          token: params[:token],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        }
      end
    end
  end
end
