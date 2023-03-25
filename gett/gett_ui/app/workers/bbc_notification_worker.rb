class BbcNotificationWorker < ApplicationWorker
  sidekiq_options queue: :default

  def perform
    # NOTE: on production we have only one BBC company,
    # but on local, dev, stage it is possible to have few
    Company.bbc.active.all.each do |company|
      Companies::SendBbcNotifications.new(company: company).execute
    end
  end
end
