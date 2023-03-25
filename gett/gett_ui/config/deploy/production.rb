server '52.214.181.254', user: "deploy", roles: %w{web app db}
set :rails_env, "production"
ask :branch, "production"
set :puma_threads, [8, 8]
set :puma_workers, 2

set :sidekiq_memory_limit, "6 GB"
set :puma_memory_limit, "6 GB"
