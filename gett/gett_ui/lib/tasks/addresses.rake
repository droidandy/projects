namespace :addresses do
  desc 'Update addresses timezones via google maps timezones api'
  task fill_timezones: :environment do
    Address.where(timezone: nil).all.each do |address|
      address.update(timezone: Timezones.timezone_at(address))
    end

    PredefinedAddress.where(timezone: nil).all.each do |predefined_address|
      predefined_address.update(timezone: Timezones.timezone_at(predefined_address))
    end
  end

  desc 'Update addresses airport'
  task fill_airports: :environment do
    Address.where(airport_id: nil).paged_each do |address|
      airport = Airport.closest(address.lat, address.lng)
      next if airport.blank?

      address.update(airport_id: airport.id)
    end

    PredefinedAddress.where(airport_id: nil).paged_each do |predefined_addresses|
      airport = Airport.closest(predefined_addresses.lat, predefined_addresses.lng)
      next if airport.blank?

      predefined_addresses.update(airport_id: airport.id)
    end
  end
end
