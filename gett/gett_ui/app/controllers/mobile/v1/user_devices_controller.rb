module Mobile::V1
  class UserDevicesController < ApplicationController
    def create
      service = UserDevices::Create.new(uuid: params[:uuid], device_attrs: device_params)

      if service.execute.success?
        head :ok
      else
        head :bad_request
      end
    end

    def destroy
      service = UserDevices::Destroy.new(token: device_params[:token])

      if service.execute.success?
        head :ok
      else
        head :bad_request
      end
    end

    private def device_params
      params.permit(
        :device_token,
        :device_type,
        :os_type,
        :client_os_version,
        :device_network_provider
      ).tap do |p|
        p[:token] = p.delete(:device_token)
      end
    end
  end
end
