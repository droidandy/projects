module Users
  class ResetPassword
    def initialize(params)
      @token = params.fetch(:reset_password_token)
      @password = params.fetch(:password)
      @password_confirmation = params.fetch(:password_confirmation)
    end

    attr_reader :success, :errors, :user

    def execute!
      @user = User.find_by(reset_password_token: @token)
      unless @user
        @success = false
        @error = 'unrecognized token'
        return
      end
      @user.update(
        password: @password,
        password_confirmation: @password_confirmation,
        reset_password_token: nil,
        reset_password_sent_at: nil
      )
      if @user.valid?
        @success = true
      else
        @success = false
        @errors = user.errors
      end
    end
  end
end
