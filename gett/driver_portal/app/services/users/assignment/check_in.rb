module Users
  module Assignment
    class CheckIn < ApplicationService
      schema do
        required(:user_id).filled(:int?)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user
        authorize! user, :check_in?, Users::AssignmentPolicy
        raise ActiveRecord::RecordNotFound unless review

        super do
          review.update(checkin_at: Time.current)
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
