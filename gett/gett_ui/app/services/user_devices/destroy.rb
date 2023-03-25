module UserDevices
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context

    attributes :token
    delegate :user, to: :context

    def execute!
      return success! if device.blank?

      update_model(device, active: false)
    end

    private def device
      @device ||= user.user_devices_dataset.first(token: token)
    end
  end
end
