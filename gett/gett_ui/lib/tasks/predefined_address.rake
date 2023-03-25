# Example:
# bin/rake predefined_addresses:fill_additional_info

namespace :predefined_addresses do
  desc 'Fill predefined addresses with street info and point of interest'
  task fill_additional_info: :environment do
    GEOCODE_INTERVAL = 0.5
    PredefinedAddress.where(street_name: nil, point_of_interest: nil).all.each do |predefined_address|
      address_fields = try_with_google(predefined_address)
      if address_fields&.compact.present?
        predefined_address.update(street_name: address_fields[0], street_number: address_fields[1], point_of_interest: address_fields[2])
      else
        puts "WARN: PredefinedAddress##{predefined_address.id} does not update all info: #street_name, #street_number, #point_of_interest. Skipping..."
      end
      sleep GEOCODE_INTERVAL
    end
  end

  def try_with_google(address)
    try_with_google_by_coords(address) || try_with_google_by_address_line(address)
  end

  def try_with_google_by_coords(address)
    return unless address.lat.present? && address.lng.present?

    google_service = GoogleApi::ReverseGeocode.new(lat: address.lat, lng: address.lng)

    return unless google_service.execute.success?

    google_service.result.values_at(:street_name, :street_number, :point_of_interest)
  end

  def try_with_google_by_address_line(address)
    line = address.line

    return if line.blank?

    google_service = GoogleApi::ReverseGeocode.new(address: line)

    return unless google_service.execute.success?

    google_service.result.values_at(:street_name, :street_number, :point_of_interest)
  end
end
