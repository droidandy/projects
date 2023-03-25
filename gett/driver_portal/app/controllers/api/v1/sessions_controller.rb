module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user!, except: %i[create]

      def show
        render json: ::Users::Show.new(current_user)
                       .as_json(with_permissions: true, with_vehicles: true, with_driver: true)
      end

      def create
        service = Sessions::Create.new(create_params)

        execute_and_process(service) do
          render json: Sessions::Show.new(service.session).as_json
        end
      end

      def update
        service = ::Users::UpdateFleet.new(current_user, update_params)

        execute_and_process(service) do
          render json: ::Users::Show.new(service.updated_user).as_json
        end
      end

      def upload_avatar
        service = ::Users::UploadAvatar.new(current_user, current_admin, avatar_params)

        execute_and_process(service) do
          render json: { avatar_url: service.avatar_url }
        end
      end

      private def create_params
        permitted :session
      end

      private def update_params
        params.require(:attributes)
          .merge(user: current_user)
          .merge(driving_cab_since: try_date(params.dig(:attributes, :driving_cab_since)))
          .merge(birth_date: try_date(params.dig(:attributes, :birth_date)))
      end

      private def avatar_params
        {
          avatar: params[:avatar]
        }
      end
    end
  end
end
