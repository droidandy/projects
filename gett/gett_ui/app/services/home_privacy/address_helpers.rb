module HomePrivacy
  module AddressHelpers
    # Converts address object to string with safe address-line
    #
    # Arguments
    #   address [PassengerAddress]
    # Options
    #   skip_sanitize [Boolean]
    # Returns [String] with safe address line
    def safe_address_line(address, skip_sanitize: false)
      return if address.nil?
      return HomePrivacy::HOME if sanitize_home_address?(address, skip_sanitize)

      address.line
    end

    # Converts address object to hash with safe home-address line
    # by default sanitize according to HomePrivacy.sanitize? value
    # but can by manually disabled/enabled by :skip_sanitize option
    #
    # Arguments
    #   address [PassengerAddress]
    # Options
    #   skip_sanitize [Boolean] - manual disable sanitizing
    #   except, include, only, root - options passed to :to_json method
    # Returns [Hash] with safe address line and filtered attributes
    def safe_address_as_json(address, **opts)
      return if address.nil?

      skip_sanitize = opts.key?(:skip_sanitize) ? opts.delete(:skip_sanitize) : false

      address.as_json(opts).tap do |json|
        json['line'] = HomePrivacy::HOME if json.key?('line') && sanitize_home_address?(address, skip_sanitize)
      end
    end

    private def sanitize_home_address?(address, skip_sanitize)
      HomePrivacy.sanitize? && !skip_sanitize && address[:passenger_address_type] == 'home'
    end
  end
end
