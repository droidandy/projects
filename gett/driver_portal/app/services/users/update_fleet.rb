module Users
  class UpdateFleet < ApplicationService
    attr_reader :updated_user

    schema do
      required(:user).filled
      optional(:account_number).maybe(:str?)
      optional(:address).maybe(:str?)
      optional(:birth_date).maybe(:date?)
      optional(:city).maybe(:str?)
      optional(:disability_description).maybe(:str?)
      optional(:disability_type).maybe(:str?)
      optional(:driving_cab_since).maybe(:date?)
      optional(:email).maybe(:str?)
      optional(:first_name).maybe(:str?)
      optional(:hobbies).maybe(:str?)
      optional(:last_name).maybe(:str?)
      optional(:phone).maybe(:str?)
      optional(:postcode).maybe(:str?)
      optional(:sort_code).maybe(:str?)
      optional(:talking_topics).maybe(:str?)
      optional(:password).maybe(:str?)
      optional(:vehicle_colour).maybe(:str?)
    end

    def execute!
      if secure_attributes? && !user.authenticate(password)
        fail!(errors: { password: 'is wrong' })
        return
      end

      if allowed_ids && !allowed_ids.include?(user.gett_id)
        fail!(errors: { base: "Please use the following Gett IDs: #{allowed_ids.to_sentence}" })
        return
      end

      if response.success?
        @updated_attributes = Drivers::Fleet::UpdateParser.new(response.result).parse
        super do
          compose(Update.new(current_user, attributes), :updated_user)
        end
      else
        fail!(errors: { base: response.error_message })
      end
    end

    private def attributes
      @updated_attributes.merge(
        gather_attributes(
          :user,
          :city,
          :hobbies,
          :talking_topics,
          :driving_cab_since,
          :disability_type,
          :disability_description
        )
      )
    end

    private def response
      @response ||= client.update_driver(
        driver_id: user.gett_id,
        attributes: fleet_attributes
      )
    end

    private def fleet_attributes
      gather_attributes(:email, :phone, :account_number, :sort_code) do |hash|
        hash[:name] = [first_name, last_name].join(' ')
        hash[:postal_address] = address if address
        hash[:zip] = postcode if postcode
        hash[:birthdate] = birth_date.to_s if birth_date
        hash[:color] = vehicle_colour
        hash[:color_en] = vehicle_colour
      end
    end

    private def secure_attributes?
      return true if account_number && account_number != user.account_number
      return true if sort_code && sort_code != user.sort_code
      false
    end

    private def client
      @client ||= GettFleetApi::Client.new
    end

    private def allowed_ids
      @allowed_ids ||= Rails.application.secrets.allowed_gett_id
    end
  end
end
