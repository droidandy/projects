require 'session'

module Users
  class LogInAs < ApplicationService
    attr_reader :session

    schema do
      required(:user_id).filled(:int?)
    end

    def execute!
      unless user
        fail!(errors: { user: 'not found' })
        return
      end

      authorize!(user)

      @session = Session.new(access_token)
      @session.touch # rubocop:disable Rails/SkipsModelValidations

      success!
    end

    private def access_token
      Session.encoded_user(user)
    end

    def user
      @user ||= begin
        search = Users::Search.new({ id: user_id }, current_user: current_user)
        search.one
      end
    end
  end
end
