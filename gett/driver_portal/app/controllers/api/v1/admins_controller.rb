module Api
  module V1
    class AdminsController < ApplicationController
      before_action :authenticate_user!

      def create
        service = ::Users::CreateAdmin.new(current_user, create_params)

        execute_and_process(service) do
          render json: ::Users::Show.new(service.user).as_json
        end
      end

      def update
        service = ::Users::UpdateAdmin.new(current_user, update_params)

        execute_and_process(service) do
          render json: ::Users::Show.new(service.updated_user).as_json
        end
      end

      private def create_params
        params.require(:attributes)
      end

      private def update_params
        params.require(:attributes).merge(user_id: params[:id].to_i)
      end
    end
  end
end
