set :production
set :branch, 'production'

server '172.22.56.171', user: 'deploy', roles: %w[app web db]

role :app, %w[deploy@172.22.56.171]
role :web, %w[deploy@172.22.56.171]
role :db,  %w[deploy@172.22.56.171]

set :base_url, 'https://uk-drivers.gett.com/api/v1'

set :ssh_options,
  forward_agent: true,
  auth_methods: %w[publickey],
  user: 'deploy'
