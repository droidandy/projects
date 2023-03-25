class AddressCityUpdaterJob < ApplicationJob
  GEOCODE_INTERVAL = 0.5

  def perform
    (addresses + predefined_addresses).each do |address|
      city = try_with_google(address)
      city ||= try_with_pcaw(address)
      city ||= try_with_pio(address)

      address.update(city: city) if city.present?
      sleep GEOCODE_INTERVAL
    end
  end

  private def try_with_google(address)
    try_with_google_by_coords(address) || try_with_google_by_address_line(address)
  end

  private def try_with_google_by_coords(address)
    return unless address.lat.present? && address.lng.present?

    google_service = GoogleApi::ReverseGeocode.new(lat: address.lat, lng: address.lng)

    return unless google_service.execute.success?

    google_service.result[:city]
  end

  private def try_with_google_by_address_line(address)
    line = address.line

    return if line.blank?

    google_service = GoogleApi::ReverseGeocode.new(address: line)

    return unless google_service.execute.success?

    google_service.result[:city]
  end

  private def try_with_pcaw(address)
    string = "#{address.line} #{address.postal_code}".strip
    origin = "#{address.lat},{address.lng}"
    pcaw_list_service = Pcaw::FetchList.new(string: string, origin: origin)

    return unless pcaw_list_service.execute.success?

    fetch_city(pcaw_list_service.result[:list])
  end

  private def fetch_city(list)
    list.each do |location|
      next unless location[:type] == 'Address'

      pcaw_address_service = Pcaw::FetchAddress.new(location_id: location[:id])

      next unless pcaw_address_service.execute.success?
      next if pcaw_address_service.result[:city].blank?

      return pcaw_address_service.result[:city]
    end

    nil
  end

  private def try_with_pio(address)
    return unless address.country_code == 'GB'

    try_with_pio_by_postal_code(address) || try_with_pio_by_coords(address)
  end

  private def try_with_pio_by_postal_code(address)
    postal_code = address.postal_code

    return if postal_code.blank?

    Postcodes::IO.new.lookup(postal_code)&.admin_district
  end

  private def try_with_pio_by_coords(address)
    return unless address.lat.present? && address.lng.present?

    Postcodes::IO.new.reverse_geocode(latitude: address.lat, longitude: address.lng)&.first&.admin_district
  end

  private def addresses
    @addresses ||= Address.dataset.where(city: nil).all
  end

  private def predefined_addresses
    @predefined_addresses ||= PredefinedAddress.dataset.where(city: nil).all
  end
end
