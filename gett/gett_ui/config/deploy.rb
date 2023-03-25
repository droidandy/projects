# config valid only for current version of Capistrano
lock "3.8.0"

set :application, "gett_ui"
set :repo_url, "git@github.com:GettUK/gett_ui.git"

# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/gett_ui"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
append :linked_files, "puma.rb", ".env"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "public/uploads", "ui/node_modules"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :rvm_type, :user
set :rvm_ruby_version, "2.4.0@gett"

set :nvm_type, :user
set :nvm_node, 'v9.11.2'
set :nvm_map_bins, %w(node npm yarn forever)

set :puma_rackup, -> { File.join(current_path, 'config.ru') }
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_conf, "#{shared_path}/puma.rb"
set :puma_access_log, "#{shared_path}/log/puma_access.log"
set :puma_error_log, "#{shared_path}/log/puma_error.log"
set :puma_role, :app
set :puma_env, fetch(:rack_env, fetch(:rails_env, 'production'))
set :puma_threads, [0, 16]
set :puma_workers, 0
set :puma_worker_timeout, nil
set :puma_init_active_record, false
set :puma_preload_app, false

set :sidekiq_memory_limit, "4 GB"
set :puma_memory_limit, "4 GB"

set :ui_path, "#{current_path}/ui"

namespace :deploy do
  namespace :db do
    desc "Seeds database or updates seeded data"
    task :seed do
      on roles(:app) do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute :rake, 'db:seed'
          end
        end
      end
    end
  end

  namespace :ui do
    desc "Upload UI build to server"
    task :upload do
      on roles(:app) do
        build_path = File.expand_path(File.dirname(__FILE__) + '/../ui/build')
        upload_path = "#{fetch(:ui_deploy_path, current_path)}/public/"

        execute "rm -r #{upload_path}/assets/css; true"
        execute "rm -r #{upload_path}/assets/images; true"
        execute "rm -r #{upload_path}/assets/js; true"

        upload! File.join(build_path, "assets"),     upload_path, recursive: true
        upload! File.join(build_path, "index.html"), upload_path
        upload! File.join(build_path, "affiliate"),  upload_path, recursive: true
        upload! File.join(build_path, "auth"),       upload_path, recursive: true
        upload! File.join(build_path, "admin"),      upload_path, recursive: true
      end
    end

    namespace :upload do
      desc <<~DESC
        Upload UI build to service during full deployment. Invoked internally.
        For manual upload, use deploy:ui:upload"
      DESC
      task :release do
        set :ui_deploy_path, release_path
        invoke 'deploy:ui:upload'
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
          execute :forever, 'stop', '--silent gettfaye; true'
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

  desc "Broadcasts deployment notification"
  task :notify do
    on roles(:app) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'notifications:deploy'
        end
      end
    end
  end

  namespace :maintenance do
    desc "enable site maintenance"
    task :enable do
      invoke 'sidekiq:monit:unmonitor'
      invoke 'sidekiq:stop'
      invoke 'puma:monit:unmonitor'
      invoke 'puma:stop'

      on roles(:app) do
        execute "cp #{current_path}/public/maintenance.html #{deploy_to}/"
      end
    end

    desc "disable site maintenance"
    task :disable do
      invoke 'sidekiq:start'
      invoke 'sidekiq:monit:monitor'
      invoke 'puma:start'
      invoke 'puma:monit:monitor'

      on roles(:app) do
        execute "rm #{deploy_to}/maintenance.html"
      end
    end
  end
end

after "deploy:updated", "deploy:db:seed"
before "deploy:compile_assets", "deploy:ui:upload:release"
after "deploy:updated", "deploy:yarn:install"
after "deploy", "deploy:faye:stop"
after "deploy", "deploy:faye:start"
after "deploy", "deploy:notify"
