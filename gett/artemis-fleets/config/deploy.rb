# config valid only for current version of Capistrano
lock "3.8.1"

set :application, "artemis-fleets"
set :repo_url, "git@github.com:GettUK/artemis-fleets.git"

set :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/artemis-fleets"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
append :linked_files, "puma.rb", "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "public/uploads", "ui/node_modules"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :rbenv_ruby, '2.4.1'

set :puma_rackup, -> { File.join(current_path, 'config.ru') }
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_conf, "#{shared_path}/puma.rb"
set :puma_access_log, "#{shared_path}/log/puma_error.log"
set :puma_error_log, "#{shared_path}/log/puma_access.log"
set :puma_role, :app
set :puma_env, fetch(:rack_env, fetch(:rails_env, 'production'))
set :puma_threads, [0, 16]
set :puma_workers, 0
set :puma_worker_timeout, nil
set :puma_preload_app, false

set :ui_path, "#{current_path}/ui"

namespace :deploy do
  namespace :ui do
    desc "Upload UI build to server"
    task :upload do
      on roles(:app) do
        build_path = File.expand_path(File.dirname(__FILE__) + '/../ui/build')
        upload_path = "#{release_path}/public/"

        upload! File.join(build_path, "assets"),     upload_path, recursive: true
        upload! File.join(build_path, "index.html"), upload_path
        upload! File.join(build_path, "auth"),       upload_path, recursive: true
        upload! File.join(build_path, "admin"),      upload_path, recursive: true
      end
    end

    desc "Reload UI build to server"
    task :reload do
      on roles(:app) do
        build_path = File.expand_path(File.dirname(__FILE__) + '/../ui/build')
        upload_path = "#{current_path}/public/"

        execute "rm -r #{current_path}/public/assets"
        execute "rm -r #{current_path}/public/auth"
        execute "rm -r #{current_path}/public/admin"
        execute "rm #{current_path}/public/index.html"
        upload! File.join(build_path, "assets"),     upload_path, recursive: true
        upload! File.join(build_path, "index.html"), upload_path
        upload! File.join(build_path, "auth"),       upload_path, recursive: true
        upload! File.join(build_path, "admin"),      upload_path, recursive: true
      end
    end
  end

  namespace :yarn do
    desc "Install node modules via yarn"
    task :install do
      on roles(:app) do
        within "#{release_path}/ui" do
          execute :yarn, 'install', "--production --silent --no-progress"
        end
      end
    end
  end

  namespace :faye do
    desc "Starts faye server"
    task :start do
      on roles(:app) do
        within fetch(:ui_path) do
          execute :forever, 'start', '--id "gettfaye" --silent ./faye/index.js'
        end
      end
    end

    desc "Stops faye server"
    task :stop do
      on roles(:app) do
        within fetch(:ui_path) do
          execute :forever, 'stop', '--silent gettfaye'
        end
      end
    end

    desc "Restarts faye server"
    task :restart do
      on roles(:app) do
        within fetch(:ui_path) do
          execute :forever, 'restart', '--silent gettfaye'
        end
      end
    end
  end
end

after "deploy:updated", "deploy:ui:upload"
after "deploy:updated", "deploy:yarn:install"
after "deploy", "deploy:faye:stop"
after "deploy", "deploy:faye:start"
