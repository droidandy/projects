require 'pub_sub'

module Agents
  class ChangeStatus < ApplicationService
    schema do
      required(:status).filled(:str?)
    end

    def execute!
      authorize!(current_user)
      return success! if current_user.agent_status&.status == status

      super do
        current_user.agent_status&.update!(current: false, ended_at: Time.current)
        current_user.agent_statuses.create!(status: status)
        update_reviews
        publish_update
        success!
      end
    end

    private def update_reviews
      case status
      when 'in_progress' then start_reviews
      when 'busy', 'offline' then finish_reviews
      end
    end

    private def start_reviews
      current_user.assigned_reviews.in_progress.each do |review|
        review.update!(training_start_at: Time.current)
      end
    end

    private def finish_reviews
      current_user.assigned_reviews.in_progress.each do |review|
        review.update!(agent: nil)
      end

      current_user.assigned_reviews.completed.each do |review|
        review.update!(training_end_at: Time.current)
      end
    end

    private def publish_update
      PubSub.publish(
        'agent_status_update',
        agent: Agents::Show.new(current_user.reload).as_json
      )
    end
  end
end
