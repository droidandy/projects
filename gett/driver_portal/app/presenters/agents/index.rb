require 'pub_sub'

module Agents
  class Index < ApplicationPresenter
    attr_reader :users

    def initialize(users)
      @users = users
    end

    def as_json
      {
        users: users_as_json,
        total: users.total_count,
        page: users.current_page,
        per_page: users.current_per_page,
        channels: channels
      }
    end

    private def users_as_json
      users.includes(:agent_status).map { |user| Agents::Show.new(user).as_json }
    end

    private def channels
      {
        agent_status_update: PubSub.channelize('agent_status_update'),
        agent_driver_assignment: PubSub.channelize('agent_driver_assignment')
      }
    end
  end
end
