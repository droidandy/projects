module System
  module SyncDrivers
    module Fleet
      class Base < ApplicationService
        FIELDS = %i[
          account_number
          car_model
          car_model_en
          city
          color
          color_en
          driver_license_id
          email
          is_frozen
          license_no
          name
          phone
          picture_url
          postal_address
          sort_code
          zip
        ].freeze

        def execute!
          raise NotImplementedError
        end

        private def process_driver!(driver_data)
          user = Users::Search.new({ gett_id: driver_data[:gett_id] }, current_user: current_user).one
          service = if user
                      Users::Update.new(
                        current_user,
                        driver_data.merge(user: user)
                      )
                    else
                      Users::Create.new(
                        current_user,
                        driver_data.merge(password_fields).merge(role: 'driver')
                      )
                    end
          service.execute!
          unless service.success?
            Rollbar.warning('Sync: user sync failed', data: driver_data, errors: service.errors)
          end
          service
        end

        private def password_fields
          password = SecureRandom.hex
          { password: password, password_confirmation: password }
        end
      end
    end
  end
end
