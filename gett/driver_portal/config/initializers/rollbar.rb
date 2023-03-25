Rollbar.configure do |config|
  config.access_token = ENV['ROLLBAR_ACCESS_TOKEN']
  config.enabled = Rails.env.production? && ENV['ROLLBAR_ACCESS_TOKEN'].present?
  config.environment = ENV['ROLLBAR_ENV'].presence || Rails.env
  config.exception_level_filters.merge!({
    'ActiveRecord::RecordNotFound' => 'ignore',
    'ActionController::RoutingError' => 'ignore'
  })
end
