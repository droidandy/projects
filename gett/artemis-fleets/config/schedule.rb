every 5.minutes do
  rake 'requests:update'
end

every 1.day do
  command 'cd /var/www/artemis-fleets/current && bundle exec pumactl -S /var/www/artemis-fleets/shared/tmp/pids/puma.state -F /var/www/artemis-fleets/shared/puma.rb restart'
end
