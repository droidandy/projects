server '35.176.187.186', user: "deploy", roles: %w{web app db}
set :default_env, CC: "gcc"
ask :branch, "staging"
set :rails_env, "staging"
set :puma_env, "staging"
set :puma_threads, [4, 4]
set :puma_workers, 1
