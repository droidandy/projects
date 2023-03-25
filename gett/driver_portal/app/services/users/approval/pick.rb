module Users
  module Approval
    class Pick < ApplicationService
      schema do
        required(:user_id).filled(:int?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user

        authorize! @user, :pick_for_approval?

        if user.approver_id
          fail!(errors: { user: 'is being approved already' })
          return
        end

        if current_user.driver_to_approve
          fail!(errors: { base: 'Another user is being approved by you' })
          return
        end

        super do
          @user.update(approver: current_user)
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
