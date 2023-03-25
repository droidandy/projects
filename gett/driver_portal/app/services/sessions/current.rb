require 'session'

module Sessions
  class Current < ApplicationService
    attr_reader :user

    schema do
      required(:access_token).filled(:str?)
    end

    def initialize(args = {})
      super(nil, args)
    end

    def execute!
      @user = session.user if session.valid?
      @user ? success! : fail!
    end

    private def session
      @session ||= ::Session.new(access_token)
    end
  end
end
