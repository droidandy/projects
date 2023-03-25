module UserDevices
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context

    attributes :uuid, :device_attrs
    delegate :user, to: :context

    def execute!
      save_model(device, device_attrs, user: user, last_logged_in_at: Time.now.utc, active: true)
    end

    private def device
      @device ||= UserDevice.find(uuid: uuid) || UserDevice.new(user: user, uuid: uuid)
    end
  end
end
