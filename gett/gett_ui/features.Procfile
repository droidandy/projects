web: RAILS_ENV=test_features rails s -p 3000 -b gett-test.me
faye: node ui/faye/index.js
webpack: sh -c 'cd ./ui && RAILS_ENV=test_features yarn start:features'
sidekiq: RAILS_ENV=test_features sidekiq
