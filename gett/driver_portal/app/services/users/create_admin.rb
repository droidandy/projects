module Users
  class CreateAdmin < ApplicationService
    attr_reader :user

    schema do
      required(:role).filled(included_in?: Role::ADMINS)
      required(:email).filled(:str?)
      required(:first_name).filled(:str?)
      required(:last_name).filled(:str?)
      required(:active).filled(:bool?)
    end

    def execute!
      compose(::Users::Create.new(current_user, attributes), :user)
      success! if @user
    end

    private def password
      @password ||= SecureRandom.hex
    end

    private def attributes
      {
        active: active,
        email: email,
        name: [first_name, last_name].join(' '),
        password_confirmation: password,
        password: password,
        role: role
      }
    end
  end
end
