set :stage

server 'driver-portal-stage.gett.systems', user: 'deploy', roles: %w[app web db]

role :app, %w[deploy@driver-portal-stage.gett.systems]
role :web, %w[deploy@driver-portal-stage.gett.systems]
role :db,  %w[deploy@driver-portal-stage.gett.systems]

set :base_url, 'http://driver-portal-stage.gett.systems/api/v1'

set :ssh_options,
  forward_agent: true,
  auth_methods: %w[publickey],
  user: 'deploy'
