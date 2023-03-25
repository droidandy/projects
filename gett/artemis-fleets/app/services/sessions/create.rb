require 'json_web_token'

module Sessions
  class Create
    def initialize(params)
      @email = params.fetch(:email).strip.downcase
      @password = params.fetch(:password)
    end

    attr_reader :success, :result, :error

    def execute!
      user = User.find_by(email: @email)

      if user.blank? || !user.authenticate(@password)
        @success = false
        @error = 'Invalid email and/or password'
      elsif !user.active?
        @success = false
        @error = 'This account was disabled'
      else
        @success = true
        @result = {token: JsonWebToken.encode(id: user.id), realm: user.realm}
      end
    end
  end
end
