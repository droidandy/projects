require 'session'

module Passwords
  class Update < ApplicationService
    attr_reader :user, :session

    schema do
      required(:token).filled(:str?)
      required(:password).filled(:str?)
      required(:password_confirmation).filled(:str?)
    end

    def initialize(args = {})
      super(nil, args)
    end

    def execute!
      @user = User.find_by(reset_password_digest: digest)

      if @user.blank?
        return fail!(errors: { token: 'is invalid or expired' })
      end

      super do
        @user.update(
          password: password,
          password_confirmation: password_confirmation,
          reset_password_digest: nil
        )
      end
    end

    on_success :create_session

    on_fail { errors!(user.errors.to_h) if user.present? }

    private def digest
      @digest ||= Digest::SHA256.hexdigest(token)
    end

    private def create_session
      @session = Session.new(access_token)
      @session.touch # rubocop:disable Rails/SkipsModelValidations
    end

    private def access_token
      Session.encoded_user(user)
    end
  end
end
