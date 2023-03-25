class WeeklyReceiptsNotifier < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    Receipts::Notifier.new.execute
  end
end
