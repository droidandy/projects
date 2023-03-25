require 'pub_sub'

module Agents
  class AssignDriver < ApplicationService
    schema do
      required(:agent_id).filled(:int?)
      required(:driver_id).filled(:int?)
    end

    def execute!
      return fail! unless agent && driver&.review
      driver.review.update!(assigned_at: Time.current, agent: agent)
      publish_update
      success!
    end

    def driver
      @driver ||= Users::Search.new(
        {
          id: driver_id,
          role: Role::DRIVERS
        },
        current_user: current_user
      ).one
    end

    private def agent
      @agent ||= Users::Search.new(
        {
          id: agent_id,
          role: Role::ONBOARDING_AGENTS
        },
        current_user: current_user
      ).one
    end

    private def publish_update
      PubSub.publish(
        'agent_driver_assignment',
        agent: Agents::Show.new(agent.reload).as_json,
        driver: Users::Assignment::Show.new(driver.reload).as_json
      )
    end
  end
end
