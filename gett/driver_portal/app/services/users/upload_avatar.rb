module Users
  class UploadAvatar < ApplicationService
    attr_reader :avatar_url

    schema do
      required(:avatar).filled
    end

    def initialize(current_user, admin, params)
      super(current_user, params)
      @admin = admin
    end

    def execute!
      authorize_admin! current_user

      success! if current_user.update(avatar: avatar)
    end

    on_success { @avatar_url = current_user.avatar.full_url }
  end
end
