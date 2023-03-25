module Sessions
  class Show < ApplicationPresenter
    attr_reader :session

    def initialize(session)
      @session = session
    end

    def as_json
      {
        access_token: session.access_token,
        user: Users::Show.new(session.user).as_json(with_permissions: true)
      }
    end
  end
end
