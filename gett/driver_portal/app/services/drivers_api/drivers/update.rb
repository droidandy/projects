module DriversApi
  module Drivers
    class Update < ::DriversApi::Base
      schema do
        required(:user).filled
      end

      def execute!
        process_response
      end

      private def response
        @response ||= begin
          client.update_driver(
            driver_id: user.gett_id,
            attributes: attributes
          )
        end
      end

      private def attributes
        {
          account_number:            user.account_number,
          birthdate:                 user.birth_date,
          city:                      user.city,
          display_name:              user.name,
          driver_license_id:         user.badge_number,
          email:                     user.email,
          hobby:                     user.hobbies,
          is_frozen:                 user.is_frozen,
          license_no:                user.license_number,
          name:                      user.name,
          national_insurance_number: user.insurance_number,
          phone:                     user.phone,
          phone2:                    user.phone,
          postal_address:            user.address,
          sort_code:                 user.sort_code,
          zip:                       user.postcode
        }
      end
    end
  end
end
