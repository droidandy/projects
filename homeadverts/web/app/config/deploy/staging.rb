set :domain,      "staging.luxuryaffairs.co.uk"
set :deploy_to,   "/var/www/html/luxuryaffairs.co.uk"
set :app_path,    "app"
set :user, 'root'
role :web,        domain
role :app,        domain, :primary => true
set :symfony_env_prod, "prod"
set :webserver_user,      "www-data"
set :composer_options,  "--verbose --quiet --prefer-dist --optimize-autoloader --no-progress"
set :branch, "staging"

namespace :resque do
  desc 'Reloads resque workers via supervisorctl'
  task :reload do
  end
end