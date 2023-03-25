module Admin::Settings
  class Edit < ApplicationService
    def execute!
      {
        deployment_notification: DeploymentNotification.current_text,
        vehicles: vehicles_data,
        ddi: Ddi.predefined.select_hash(:type, :phone)
      }
    end

    private def vehicles_data
      vehicles.each_with_object({}) do |vehicle, data|
        data[vehicle[:name]] = {
          pre_eta: vehicle[:pre_eta],
          earliest_available_in: vehicle[:earliest_available_in],
          name: vehicle[:name]
        }
      end
    end

    private def vehicles
      @vehicles ||= DB[:vehicle_products].all
    end
  end
end
