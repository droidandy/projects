require_relative 'boot'

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
Bundler.require(*Rails.groups)

module DriverPortal
  class Application < Rails::Application
    config.load_defaults 5.1
    config.api_only = true
    config.active_job.queue_adapter = :sidekiq
    config.time_zone = 'London'
    config.action_mailer.asset_host = Rails.application.secrets.asset_host
    config.asset_host = Rails.application.secrets.asset_host
  end
end
