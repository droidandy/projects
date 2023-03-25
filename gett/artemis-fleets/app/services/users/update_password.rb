module Users
  class UpdatePassword
    def initialize(user, params)
      @user = user
      @current_password = params.fetch(:current_password)
      @password = params.fetch(:password)
      @password_confirmation = params.fetch(:password_confirmation)
    end

    attr_reader :success, :errors

    def execute!
      unless @user.authenticate(@current_password)
        @success = false
        @errors = {current_password: ['invalid']}
        return
      end

      @user.update(
        password: @password,
        password_confirmation: @password_confirmation
      )

      if @user.valid?
        @success = true
      else
        @success = false
        @errors = @user.errors
      end
    end
  end
end
