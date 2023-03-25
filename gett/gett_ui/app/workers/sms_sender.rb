class SmsSender < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform(phone, message)
    Nexmo::SMS.new(phone: phone, message: message).execute
  end
end
