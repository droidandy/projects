set :dev

server 'uk-driver-portal-dev.gett.io', user: 'deploy', roles: %w[app web db]

role :app, %w[deploy@uk-driver-portal-dev.gett.io]
role :web, %w[deploy@uk-driver-portal-dev.gett.io]
role :db,  %w[deploy@uk-driver-portal-dev.gett.io]

set :base_url, 'http://uk-driver-portal-dev.gett.io/api/v1'

set :ssh_options,
  forward_agent: true,
  auth_methods: %w[publickey],
  user: 'deploy'

namespace :deploy do
  desc 'Restart swagger to re-link docs file'
  task :restart_swagger do
    on roles(:app) do
      execute "cd #{release_path}/swagger && docker-compose restart"
    end
  end
end
