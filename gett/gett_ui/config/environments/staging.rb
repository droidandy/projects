load Rails.root.join('config/environments/production.rb')

GettBookers::Application.configure do
  config.action_mailer.default_url_options = {host: 'https://stage.gettaxi.me'}
  config.action_mailer.asset_host = 'https://stage.gettaxi.me'
end
