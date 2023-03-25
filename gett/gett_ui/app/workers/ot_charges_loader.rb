class OTChargesLoader < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    OneTransport::ChargesLoader.new.execute
  end
end
