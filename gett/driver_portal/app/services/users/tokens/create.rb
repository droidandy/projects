require 'token_manager'

module Users
  module Tokens
    class Create < ApplicationService
      attr_reader :token

      schema do
        required(:driver_id).filled(:int?)
      end

      def initialize(params)
        super(nil, params)
      end

      def execute!
        return fail!(errors: { user: 'not found' }) unless user

        success! if token_manager.write
      end

      on_success { @token = token_manager.token }

      private def user
        User.find_by(id: driver_id)
      end

      private def token_manager
        @token_manager ||= TokenManager.new(driver_id: driver_id)
      end
    end
  end
end
