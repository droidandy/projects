module Users
  class Deactivate < ApplicationService
    schema do
      required(:user_id).filled(:int?)
    end

    def execute!
      unless user
        fail!(errors: { user: 'not found' })
        return
      end

      unless user.active?
        fail!(errors: { user: 'already blocked' })
        return
      end

      authorize!(user)
      super do
        user.update(blocked_at: Time.current)
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
