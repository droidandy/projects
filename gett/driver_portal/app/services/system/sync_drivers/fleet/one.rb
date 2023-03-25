module System
  module SyncDrivers
    module Fleet
      class One < Base
        schema do
          required(:driver_id).filled(:int?)
        end

        def execute!
          compose(Drivers::Fleet::One.new(current_user, driver_id: driver_id, fields: FIELDS), :driver)
          return unless @driver

          result = process_driver!(@driver)
          result.success? ? success! : fail!(errors: result.errors)
        end
      end
    end
  end
end
