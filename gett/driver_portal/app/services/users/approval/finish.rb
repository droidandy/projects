module Users
  module Approval
    class Finish < ApplicationService
      schema do
        required(:user_id).filled(:int?)
        required(:subject).filled(:str?)
        required(:message).filled(:str?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user

        authorize! user, :finish?, Users::ApprovalPolicy

        super do
          user.update(approver: nil)
        end
      end

      on_fail { errors!(user.errors.to_h) if user.present? }
      on_success { send_notification }

      def user
        @user ||= begin
          search = Users::Search.new({ id: user_id }, current_user: current_user)
          search.one
        end
      end

      private def send_notification
        UsersMailer.approval(user, subject, message).deliver_now
      end
    end
  end
end
