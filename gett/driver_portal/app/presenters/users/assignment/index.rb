require 'pub_sub'

module Users
  module Assignment
    class Index < ApplicationPresenter
      def initialize(users)
        @users = users
      end

      def as_json(with_pagination: true)
        json = { drivers: @users.preload(review: :agent).map { |user| Users::Assignment::Show.new(user).as_json } }
        json.merge!(paginaton_attributes) if with_pagination
        json[:channels] = channels
        json
      end

      private def paginaton_attributes
        {
          total: @users.total_count,
          page: @users.current_page,
          per_page: @users.current_per_page
        }
      end

      private def channels
        {
          agent_driver_assignment: PubSub.channelize('agent_driver_assignment'),
          driver_documents_status: PubSub.channelize('driver_documents_status')
        }
      end
    end
  end
end
