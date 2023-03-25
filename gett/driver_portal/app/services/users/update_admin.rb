module Users
  class UpdateAdmin < ApplicationService
    attr_reader :updated_user

    schema do
      required(:user_id).filled(:int?)
      required(:role).filled(included_in?: Role::ADMINS)
      required(:email).filled(:str?)
      required(:first_name).filled(:str?)
      required(:last_name).filled(:str?)
      required(:active).filled(:bool?)
    end

    def execute!
      raise ActiveRecord::RecordNotFound unless user_to_update

      compose(::Users::Update.new(current_user, attributes), :updated_user)
      success! if @updated_user
    end

    private def attributes
      {
        user: user_to_update,
        active: active,
        email: email,
        name: [first_name, last_name].join(' '),
        role: role
      }
    end

    private def user_to_update
      @user_to_update ||= begin
        search = Users::Search.new({ id: user_id }, current_user: current_user)
        search.one
      end
    end
  end
end
