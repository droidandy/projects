module DriversApi
  module Cars
    class Assign < ::DriversApi::Base
      schema do
        required(:vehicle).filled
      end

      private def response
        @response ||= begin
          client.assign_car(
            driver_id: vehicle.user.gett_id,
            car_id: vehicle.gett_id,
            title: vehicle.title
          )
        end
      end
    end
  end
end
