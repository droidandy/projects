module Api
  module V1
    module Users
      class ApprovalController < ApplicationController
        before_action :authenticate_user!

        def pick
          service = ::Users::Approval::Pick.new(current_user, member_params)

          execute_and_process(service) do
            render json: { driver_to_approve_id: service.user.id }
          end
        end

        def drop
          service = ::Users::Approval::Drop.new(current_user, member_params)

          execute_and_process(service)
        end

        def finish
          service = ::Users::Approval::Finish.new(current_user, finish_params)

          execute_and_process(service)
        end

        def start
          service = ::Users::Approval::Start.new(current_user)

          execute_and_process(service) do
            render json: { driver_to_approve_id: service.user.id }
          end
        end

        def notification
          render json: ::Users::Approval::Notification.new(current_user, member_params).as_json
        end

        private def member_params
          { user_id: params[:id] }
        end

        private def finish_params
          {
            user_id: params[:id],
            subject: params[:subject],
            message: params[:message]
          }
        end
      end
    end
  end
end
