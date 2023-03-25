module Agents
  class Show < ApplicationPresenter
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def as_json
      convert_to_json(user, only: %i[id first_name last_name]) do |json|
        json.merge!(
          assigned_drivers_count: user.assigned_reviews.in_progress.count,
          agent_status: user.agent_status&.status,
          agent_status_updated_at: user.agent_status&.created_at
        )
      end
    end
  end
end
