module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!, except: %i[create avatar]

      def index
        search = ::Users::Search.new(index_params, current_user: current_user)

        render json: ::Users::Index.new(search.admins.preload(:roles)).as_json
      end

      def drivers
        search = ::Users::Search.new(index_params, current_user: current_user)

        render json: ::Users::Index.new(search.drivers.preload(:roles)).as_json
      end

      def show
        user = ::Users::Search.new({ id: params[:id] }, current_user: current_user).one

        if user
          render json: ::Users::Show.new(user).as_json
        else
          head 404
        end
      end

      def create
        service = ::Users::Register.new(create_params)
        execute_and_process(service)
      end

      def activate
        service = ::Users::Activate.new(current_user, member_params)

        execute_and_process(service) do
          render json: ::Users::Show.new(service.user).as_json
        end
      end

      def deactivate
        service = ::Users::Deactivate.new(current_user, member_params)

        execute_and_process(service) do
          render json: ::Users::Show.new(service.user).as_json
        end
      end

      def batch_activate
        service = ::Users::BatchActivate.new(current_user, batch_params)

        execute_and_process(service) do
          render json: BatchService::Show.new(service).as_json
        end
      end

      def batch_deactivate
        service = ::Users::BatchDeactivate.new(current_user, batch_params)

        execute_and_process(service) do
          render json: BatchService::Show.new(service).as_json
        end
      end

      def log_in_as
        service = ::Users::LogInAs.new(current_user, member_params)

        execute_and_process(service) do
          render json: Sessions::Show.new(service.session).as_json
        end
      end

      def sync
        SyncDriversJob.perform_later

        head :ok
      end

      def avatar
        user = User.find(params[:id])
        if user.try(:avatar)
          redirect_to user.avatar.full_url
        else
          head 404
        end
      end

      private def index_params
        {
          query: params[:query],
          category: params[:category] || 'all',
          role: params[:role],
          page: params[:page] || 1,
          per_page: params[:per_page] || 5,
          sort_column: params[:sort_column],
          sort_direction: params[:sort_direction]
        }
      end

      private def create_params
        params.require(:attributes)
      end

      private def member_params
        { user_id: params[:id] }
      end

      private def batch_params
        {
          user_ids: params[:user_ids]
        }
      end
    end
  end
end
