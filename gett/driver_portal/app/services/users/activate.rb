module Users
  class Activate < ApplicationService
    schema do
      required(:user_id).filled(:int?)
    end

    def execute!
      unless user
        fail!(errors: { user: 'not found' })
        return
      end

      if user.active?
        fail!(errors: { user: 'already activated' })
        return
      end

      authorize!(user)
      super do
        user.update(blocked_at: nil)
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
