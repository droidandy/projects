require 'sidekiq-scheduler'

class ApplicationWorker
  include ApplicationService::FailSafe
  include Sidekiq::Worker

  def self.sidekiq_options(opts = {})
    unless Rails.env.development? || Rails.env.test?
      opts.stringify_keys!
      queue = opts['queue'] || :default
      opts['queue'] = "gett_#{queue}"
    end

    super(opts)
  end
end
