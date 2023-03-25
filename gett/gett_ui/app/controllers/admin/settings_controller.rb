class Admin::SettingsController < Admin::BaseController
  def edit
    render json: Admin::Settings::Edit.new.execute.result
  end

  def update_vehicle_value
    service = Admin::Settings::UpdateVehicleValue.new(vehicle_field_params)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def update_deployment_notification
    service = Admin::Settings::UpdateDeploymentNotification.new(text: deployment_notification)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def update_ddi_phone
    if Admin::Ddis::UpdatePredefined.new(ddi_params).execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def vehicle_field_params
    params.permit(:vehicle_name, :field, :value)
  end

  private def deployment_notification
    params.require(:deployment_notification)
  end

  private def ddi_params
    params.require(:ddi).permit(:type, :phone)
  end
end
