### Gett UK Ruby on Rails service contract
 
#### Usage
Add this to your application's Gemfile with any required gems:
```ruby
github 'gettuk/service_contract', branch: 'master' do
  gem 'gett-api'
  gem 'gett-mq'
  gem 'gett-ui'
end
```

#### Development
To create a new service contract gem:
```shell
./create.sh mygem
cd gett-mygem
bundle install
bundle exec rake
```

If your gem depends on another gem in this repo:
- Add the following to `gett-mygem.gemspec`
```ruby
spec.add_dependency 'gett-anothergem'
```
- Add the following to `Gemfile`
```ruby
path '..' do
  gem 'gett-anothergem'
end
```
- Add the following to `lib/gett/mygem.rb`
```ruby
require 'gett-anothergem'
```
