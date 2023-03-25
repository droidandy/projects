### Enterprise bookkeeping micro-service

#### Setup
```bash
cp .env.example .env
cp config/database.yml.example config/database.yml
cp config/settings.yml.example config/settings.yml
bundle exec rake db:setup
bundle exec rails s
bundle exec rspec
```

#### Config
- Adding `SETTINGS__CUSTOM_CONFIG__VALUE_1=1` to `.env` will be accessible as `Settings.custom_config.value_1`
- Adding `custom_config: {item_1: 1}` to `config/settings.yml` will be accessible as `Settings.custom_config.item_1`
