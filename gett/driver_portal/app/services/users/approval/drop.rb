module Users
  module Approval
    class Drop < ApplicationService
      schema do
        required(:user_id).filled(:int?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user

        authorize! user, :drop?, Users::ApprovalPolicy

        super do
          user.update(approver: nil)
        end
      end

      on_fail { errors!(user.errors.to_h) if user.present? }

      def user
        @user ||= begin
          search = Users::Search.new({ id: user_id }, current_user: current_user)
          search.one
        end
      end
    end
  end
end
