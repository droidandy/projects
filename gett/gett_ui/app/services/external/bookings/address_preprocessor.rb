module External::Bookings::AddressPreprocessor
  def execute!
    # line bellow will deep dup original hash, allowing free mutations on this object
    attributes[:params] = params.to_h.with_indifferent_access
    preprocess_addresses!
    super
  end

  private def preprocess_addresses!
    preprocess_address!(params[:pickup_address])
    preprocess_address!(params[:destination_address])

    params[:stops]&.each do |stop_params|
      preprocess_address!(stop_params[:address])
    end
  end

  private def preprocess_address!(address_params)
    return if address_params.blank?

    service = GoogleApi::ReverseGeocode.new(address_params.slice(:lat, :lng))

    return unless service.execute.success?

    address_params.merge!(line: service.result[:formatted_address])
  end
end
