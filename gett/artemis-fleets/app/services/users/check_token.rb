module Users
  class CheckToken
    def initialize(token)
      @token = token
    end

    attr_reader :valid

    def execute!
      @valid = User.find_by(reset_password_token: @token).present?
    end
  end
end
