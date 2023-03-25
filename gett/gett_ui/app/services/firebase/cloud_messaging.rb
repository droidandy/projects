module Firebase
  class CloudMessaging < ApplicationService
    attributes :devices, :message

    delegate :server_key, to: 'Settings.firebase'

    def execute!
      # In development, execute only if flag was explicitly enabled
      return if Rails.env.development? && secrets.enabled != 'true'

      response = FCM.new(server_key).send(devices, message)

      response[:status_code] == 200 && JSON.parse(response[:body])['success'] > 0
    end
  end
end
