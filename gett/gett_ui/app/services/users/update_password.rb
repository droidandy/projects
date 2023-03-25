module Users
  class UpdatePassword < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :params

    delegate :user, :reincarnated?, to: :context

    def execute!
      return set_errors(current_password: ['The password you entered is incorrect']) unless user.valid_password?(current_password) || reincarnated?

      update_model(user, user_params)
    end

    def errors
      @errors || user.errors
    end

    private def current_password
      params[:current_password]
    end

    private def user_params
      params.slice(:password, :password_confirmation)
    end
  end
end
