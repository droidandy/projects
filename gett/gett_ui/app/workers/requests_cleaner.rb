class RequestsCleaner < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  EXPIRATION_DAYS = 3

  def perform
    Request.where{ created_at < Time.current - EXPIRATION_DAYS.days }.delete
  end
end
