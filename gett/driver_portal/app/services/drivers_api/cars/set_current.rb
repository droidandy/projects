module DriversApi
  module Cars
    class SetCurrent < ::DriversApi::Base
      schema do
        required(:vehicle).filled
      end

      private def response
        @response ||= begin
          client.update_driver(
            driver_id: vehicle.user.gett_id,
            attributes: {
              current_car: {
                id: vehicle.gett_id
              }
            }
          )
        end
      end
    end
  end
end
