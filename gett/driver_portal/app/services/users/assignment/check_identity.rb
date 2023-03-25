module Users
  module Assignment
    class CheckIdentity < ApplicationService
      schema do
        required(:user_id).filled(:int?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user
        authorize! user, :check_identity?, Users::AssignmentPolicy
        raise ActiveRecord::RecordNotFound unless review

        super do
          review.update(identity_checked_at: Time.current)
        end
      end

      on_fail { errors!(review.errors.to_h) if review.present? }

      def user
        @user ||= Users::Search.new({ id: user_id }, current_user: current_user).one
      end

      private def review
        @review ||= user.review
      end
    end
  end
end
