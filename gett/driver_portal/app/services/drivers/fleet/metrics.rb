module Drivers
  module Fleet
    class Metrics < ApplicationService
      attr_reader :driver_data

      schema do
        required(:user_id).filled(:int?)
      end

      def execute!
        unless user
          fail!(errors: { user: 'not found' })
          return
        end

        compose(
          One.new(
            current_user,
            driver_id: user.gett_id,
            fields: %i[statistics computed_rating]
          ),
          :driver,
          as: :driver_data
        )

        success! if @driver_data
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
