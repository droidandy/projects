set :stages,        %w(production staging staging2 homeadverts)
set :default_stage, "staging"
set :stage_dir,     "app/config/deploy"
require 'capistrano/ext/multistage'

set :application, "homeadverts"

set :repository,  "git@github.com:Homeadverts/web.git"
set :scm,         :git

set :model_manager, "doctrine"

set :keep_releases,  5
set :deploy_via, :remote_cache
set :use_sudo, false
set :use_composer, true
set :update_composer, true
set :copy_vendors, false
set :composer_bin, "/usr/bin/composer"
set :normalize_asset_timestamps, false

set :symfony_console, "app/console"
set :cache_path, "app/cache"
set :log_path, "app/logs"

logger.level = Logger::MAX_LEVEL

set :shared_children, ["web/sitemaps", "app/logs"]
set :shared_files, ["app/config/parameters.yml"]

ssh_options[:forward_agent] = true
ssh_options[:auth_methods] = ["publickey"]


default_run_options[:pty] = true

task :set_cache_permissions do
    try_sudo "chmod -R 777 #{latest_release}/app/cache"
    try_sudo "chmod -R 777 #{latest_release}/app/logs"
end
after "deploy:create_symlink", "set_cache_permissions"
after "symfony:cache:clear", "set_cache_permissions"

after 'deploy:update', 'deploy:cleanup'

task :ssh do
  system "ssh -t #{user}@#{domain} 'cd #{latest_release}; exec \$SHELL -l'"
end

# Ensure we don't have any reference to app_dev in the htaccess
task :update_htaccess do
    try_sudo "sed 's/app_dev\\.php/app.php/' #{latest_release}/web/.htaccess > #{latest_release}/web/.htaccess.new; mv #{latest_release}/web/.htaccess.new #{latest_release}/web/.htaccess;"
end
before "deploy:create_symlink", "update_htaccess"

# build Compass
namespace :compass do
  desc 'Updates stylesheets if necessary from their Sass templates.'
  task :compile do
    try_sudo "cd #{latest_release}; compass compile --output-style compressed --force;"
  end
end

before 'deploy:create_symlink', 'bower:install'

namespace :bower do
    desc 'Run bower install'
    task :install do
      try_sudo "cd #{latest_release}; bower install --allow-root"
    end
end

before 'deploy:create_symlink', 'compass:compile'

namespace :npm do
  desc 'Installs NPM dependencies'
  task :install do
    try_sudo "cd #{latest_release}; npm install --loglevel silent;"
  end
end

before 'deploy:create_symlink', 'npm:install'


namespace :assets do
  desc 'Build the static assets'
  task :build do
    try_sudo "cd #{latest_release}; app/console asset:dump --env=prod"
  end
end

after 'npm:install', 'assets:build'


# Reload NGINX config after deploy
namespace :deploy do
  desc "Reload NGINX"
  task :reloadnginx, :roles => :app do
    try_sudo "service nginx restart"
  end
end

after "deploy:create_symlink", "deploy:reloadnginx"

# Reload PHP-FPM config after deploy
namespace :fpm do
  desc "Reload PHP-FPM"
  task :reload, :roles => :app do
    try_sudo "service php7.2-fpm reload"
  end
end

after "deploy:create_symlink", "fpm:reload"

namespace :resque do
  desc 'Reloads resque workers via supervisorctl'
  task :reload do
    try_sudo "supervisorctl restart all"
  end
end

after "deploy:create_symlink", "resque:reload"
