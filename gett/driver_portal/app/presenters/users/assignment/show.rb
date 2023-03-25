require 'compliance_queue'

module Users
  module Assignment
    class Show < ApplicationPresenter
      attr_reader :user

      delegate :review, to: :user

      def initialize(user)
        @user = user
      end

      COLUMNS_TO_SHOW = %i[
        id
        phone
      ].freeze

      def as_json
        convert_to_json(user, only: COLUMNS_TO_SHOW) do |json|
          json[:name] = user.name
          json[:license] = user.license_number
          json[:scheduled_at] = review&.scheduled_at
          json[:checkin_at] = review&.checkin_at
          json[:identity_checked_at] = review&.identity_checked_at
          json[:documents_ready] = documents_ready?
          json[:completed] = review&.completed
          json[:agent] = agent_data if review.agent
        end
      end

      private def documents_ready?
        ComplianceQueue.new(user).documents_ready?
      end

      private def agent_data
        {
          id: review.agent.id,
          name: review.agent.name
        }
      end
    end
  end
end
