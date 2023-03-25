module Api
  module V1
    module Assignment
      class DriversController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Users::Search.new(index_params, current_user: current_user)

          render json: ::Users::Assignment::Index.new(
            search.resolved_scope.order('reviews.scheduled_at ASC')
          ).as_json
        end

        def check_in
          service = ::Users::Assignment::CheckIn.new(current_user, member_params)

          execute_and_process(service) do
            render json: ::Users::Assignment::Show.new(service.user).as_json
          end
        end

        def check_identity
          service = ::Users::Assignment::CheckIdentity.new(current_user, member_params)

          execute_and_process(service) do
            render json: ::Users::Assignment::Show.new(service.user).as_json
          end
        end

        def assigned_to_me
          search = ::Users::Search.new(my_params, current_user: current_user)

          render json: ::Users::Assignment::Index.new(search.resolved_scope).as_json(with_pagination: false)
        end

        private def index_params
          {
            page: params[:page] || 1,
            per_page: params[:per_page] || 5,
            ready_for_assignment: params[:ready_for_assignment].present?,
            appointment_from: try_datetime(params[:from]),
            appointment_to: try_datetime(params[:to]),
            query: params[:query],
            category: 'assignment',
            with_appointment: true
          }
        end

        private def my_params
          {
            being_reviewed_by: current_user.id
          }
        end

        private def member_params
          { user_id: params[:id] }
        end
      end
    end
  end
end
