module Api
  module V1
    class InvitesController < ApplicationController
      before_action :authenticate_user!, only: %i[create batch_create]

      def show
        service = Invites::Decode.new(show_params)

        execute_and_process(service) do
          render json: Invites::Show.new(service.invite).as_json(with_user: true)
        end
      end

      def create
        service = Invites::Create.new(current_user, create_params)

        execute_and_process(service) do
          render json: Invites::Show.new(service.invite).as_json(with_user: true)
        end
      end

      def batch_create
        service = Invites::BatchCreate.new(current_user, batch_params)

        execute_and_process(service) do
          render json: BatchService::Show.new(service).as_json
        end
      end

      def update
        service = Invites::Update.new(current_user, update_params)

        execute_and_process(service) do
          if service.session
            render json: Sessions::Show.new(service.session).as_json
          else
            render json: Invites::Show.new(service.invite).as_json(with_user: true)
          end
        end
      end

      private def show_params
        {
          token: params[:token]
        }
      end

      private def create_params
        {
          user_id: params[:id]
        }
      end

      private def batch_params
        {
          user_ids: params[:user_ids]
        }
      end

      private def update_params
        {
          token: params[:token],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        }
      end
    end
  end
end
