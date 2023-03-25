module Drivers
  module Stats
    class Get < ApplicationService
      attr_reader :stats

      schema do
        required(:user_id).filled
      end

      def execute!
        unless user
          fail!(errors: { user: 'not found' })
          return
        end
        return unless raw_stats

        @stats = Drivers::Stats::Parser.new(raw_stats).parse
        success!
      end

      private def raw_stats
        @raw_stats ||= if response.success?
                         response.body
                       else
                         fail!(errors: { data: 'was not retrieved' })
                         nil
                       end
      end

      private def response
        @response ||= client.driver_stats(id: user.gett_id)
      end

      private def client
        @client ||= FinancePortalApi::Client.new
      end

      private def user
        @user ||= begin
          search = Users::Search.new({ id: user_id }, current_user: current_user)
          search.one
        end
      end
    end
  end
end
