require 'token_manager'
require 'session'

module Users
  module Tokens
    class Exchange < ApplicationService
      attr_reader :session

      schema do
        required(:token).filled(:str?)
      end

      def initialize(params)
        super(nil, params)
      end

      def execute!
        raise ActiveRecord::RecordNotFound unless user

        @session = Session.new(access_token)
        @session.touch # rubocop:disable Rails/SkipsModelValidations

        success!
      end

      private def user
        @user ||= User.find_by(id: token_manager.driver_id)
      end

      private def access_token
        Session.encoded_user(user)
      end

      private def token_manager
        @token_manager ||= TokenManager.new(token: token)
      end
    end
  end
end
