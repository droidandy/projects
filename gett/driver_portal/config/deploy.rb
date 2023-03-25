lock "~> 3.10.0"

set :application, 'driver_portal'
set :repo_url, 'git@github.com:GettUK/driver_portal.git'
set :branch, 'master'
set :stages, %w[dev stage production]
set :default_stage, 'dev'
set :use_sudo, false
set :rails_env, 'production'

set :linked_files, fetch(:linked_files, []).push(
  'config/database.yml',
  'config/secrets.yml'
)

set :linked_dirs, fetch(:linked_dirs, []).push(
  'ui/node_modules',
  'tmp/pids',
  'tmp/sockets',
  'log',
  'public/system'
)

set :keep_releases, 10

set :rollbar_token, ENV['ROLLBAR_ACCESS_TOKEN']
set :rollbar_env, (proc { fetch :stage })
set :rollbar_role, (proc { :app })

set :deploy_to, '/home/deploy/driver_portal'
set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :base_url, 'http://driver-portal-dev.gett.systems/api/v1'

namespace :deploy do
  task :precompile do
    on roles(:app) do
      execute "cd #{release_path}/ui && yarn install"
      execute "cd #{release_path}/ui && REACT_APP_API_BASE_URL=#{fetch(:base_url)} yarn build"
      execute "cp -r #{release_path}/ui/build/* #{release_path}/public/"
    end
  end

  desc 'Restart server'
  task :restart do
    on roles(:app) do
    end
  end

  before 'publishing', :precompile
  after :publishing, :restart

  namespace :faye do
    desc "Starts faye server"
    task :start do
      on roles(:app) do
        within "#{release_path}/ui" do
          execute :forever, 'start', '--id "dpfaye" --silent ./faye/index.js'
        end
      end
    end

    desc "Stops faye server"
    task :stop do
      on roles(:app) do
        within "#{release_path}/ui" do
          execute :forever, 'stop', '--silent dpfaye; true'
        end
      end
    end

    desc "Restarts faye server"
    task :restart do
      on roles(:app) do
        within "#{release_path}/ui" do
          execute :forever, 'restart', '--silent dpfaye'
        end
      end
    end
  end
end

after "deploy", "deploy:faye:stop"
after "deploy", "deploy:faye:start"
