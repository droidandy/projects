class DriversChannelWorker < ApplicationWorker
  sidekiq_options queue: :default, retry: false, unique: :until_and_while_executing

  def perform
    DriversChannel.each do |dc|
      drivers = Gett::DriversList.new(lat: dc.lat, lng: dc.lng, country_code: dc.country_code).execute.result

      Faye.notify_channel(dc.channel, drivers: drivers, dies_in: (dc.valid_until.to_time - Time.current).to_i)
    end
  end
end
