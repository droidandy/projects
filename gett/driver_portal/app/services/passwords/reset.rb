module Passwords
  class Reset < ApplicationService
    attr_reader :user

    schema do
      required(:email).filled(:str?)
    end

    def initialize(args = {})
      super(nil, args)
    end

    def execute!
      @user = User.find_by(email: User.normalized_email(email))

      if @user.present?
        @user.update(reset_password_digest: digest)
      end

      # if user with such email does not exist we should indicate is
      # success anyway to avoid possibility of email brute forcing

      success!
    end

    on_success :send_email

    def token
      @token ||= SecureRandom.urlsafe_base64
    end

    def digest
      @digest ||= Digest::SHA256.hexdigest(token)
    end

    private def send_email
      return if user.blank?
      UsersMailer.reset_password(user, token).deliver_now
    end
  end
end
