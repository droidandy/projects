module DriversApi
  module Drivers
    class Send < ApplicationService
      schema do
        required(:user).filled
      end

      def execute!
        compose(DriversApi::Drivers::Create.new(current_user, user: user), :driver_id)
        return unless @driver_id

        success! if user.update(gett_id: @driver_id)
      end
    end
  end
end
