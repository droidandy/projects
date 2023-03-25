require 'sidekiq'

Sidekiq.configure_client do |config|
  config.redis = { size: 1 }
end

require 'sidekiq/web'
require 'sidekiq/cron/web'

map '/monitor' do
  run Sidekiq::Web
end
