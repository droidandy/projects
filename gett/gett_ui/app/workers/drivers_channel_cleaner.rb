class DriversChannelCleaner < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    DriversChannel.expired.delete
  end
end
