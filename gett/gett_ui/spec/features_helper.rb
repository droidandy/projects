ENV['RAILS_ENV'] ||= 'test_features'

require File.expand_path('../../config/environment', __FILE__)
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'spec_helper'
require 'rspec/rails'
require 'capybara'
require 'capybara/rails'
require 'capybara/rspec'
require 'capybara-screenshot/rspec'
require 'site_prism'
require 'faker/formatted_phone_number'
Sequel::Model.db.extension(:null_dataset)

Dir[Rails.root.join('spec.features/support/**/*.rb')].each { |f| require f }

RSpec.configure do |config|
  Faker::Config.locale = 'en-GB'
  config.include FactoryGirl::Syntax::Methods
  config.include HeadersHelper
  config.include WaitUntilTrueHelper
  config.include LoginHelper
  config.include VerboseHelper
  config.use_transactional_fixtures = false
  config.verbose_retry = true
  config.display_try_failure_messages = true

  config.before(:suite) do
    DatabaseCleaner[:sequel].strategy = :truncation, {except: %w[vehicles predefined_addresses roles ddis airports spatial_ref_sys]}
    DatabaseCleaner[:sequel].db = DB
    DatabaseCleaner[:sequel].clean_with(:truncation, except: %w[spatial_ref_sys])
    Fog.mock!
    Fog::Mock.delay = 0
    S3TmpFile.connection.directories.create(key: Settings.s3.tmp_bucket)
    Rails.application.load_seed
  end

  config.after(:suite) do
    BrowserMobHelper.instance.close unless ENV['CI']
    results = RSpec.world.all_examples.map { |e| e.metadata[:detailed_result] }.compact
    File.open('log/test_performance.log', 'w+') do |f|
      f.puts format("%-110.110s %-10.10s %-10.10s %-10.10s", 'Example', 'Wait', 'Total', 'Sleep')
      results
        .sort_by { |_example, wait| -wait }
        .each { |result| f.puts format("%-110.110s %-10.10s %-10.10s %-10.10s", *result) }

      f.puts
      f.puts

      BM.details[:aggregated].to_a.sort_by(&:second).reverse.each do |line|
        f.puts format("%-110.110s %-10.10s", *line)
      end

      f.puts
      f.puts

      BM.details[:details].sort_by { |info| -info[0] }.each do |(wait, trace)|
        stripped = trace.map { |l| l.gsub!(/.*?(?=spec.features)/im, '') }
        f.puts format("%-10.10s %-110.110s", wait, stripped.first)
        stripped[1..-1].each do |line|
          f.puts format("%-10.10s %-110.110s", '', line)
        end
      end
    end
  end
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  config.before(:each) do
    BM.count_setup_db do
      DatabaseCleaner[:sequel].start
      UITest.create_superadmin
    end
  end

  config.around(:each) do |example|
    FactoryGirl.use_feature_factories do
      retries = ENV['CI'] ? 2 : 0
      BM.reset!
      BM.measure(:example) do
        example.run_with_retry(retry: retries)
      end

      example.metadata[:detailed_result] = [
        # rubocop:disable Style/FormatStringToken
        format("%s[%s]", example.metadata[:rerun_file_path], example.metadata[:scoped_id]),
        # rubocop:enable Style/FormatStringToken
        BM.measurements[:wait_until_true].to_i,
        BM.measurements[:example].to_i,
        BM.measurements[:sleep].to_i
      ]
    end
  end

  config.after(:each) do |example|
    clear_all_headers
    BM.count_clear_db do
      DatabaseCleaner[:sequel].clean
    end

    if example.exception.is_a? Net::ReadTimeout
      # rubocop:disable Style/GlobalVars
      $net_timeouts_count ||= 0
      $net_timeouts_count += 1
      exit(1) if $net_timeouts_count >= 5
      # rubocop:enable Style/GlobalVars
    end
  end
end

Capybara.run_server = false
Capybara.app_host = ENV.fetch('CAPYBARA_APP_HOST', 'http://gett-test.me:3030')
Capybara.default_max_wait_time = 10

Capybara.register_driver :selenium_headless_chrome do |app|
  proxy_address = BrowserMobHelper.instance.selenium_proxy_address

  template = File.read("#{Rails.root}/spec.features/support/proxy.pac.template")
  template.gsub!('__ADDRESS__', proxy_address)
  File.open("#{Rails.root}/tmp/proxy.pac", 'w+') do |file|
    file.puts template
  end

  # Use headless as soon as https://bugs.chromium.org/p/chromium/issues/detail?id=765245
  # is resolved
  headless = false # ENV['CIRCLECI']

  proxy = Selenium::WebDriver::Proxy.new(type: :pac, pac: "file://#{Rails.root}/tmp/proxy.pac")

  caps = Selenium::WebDriver::Remote::Capabilities.chrome(proxy: proxy)

  args = %w(start-maximized disable-infobars window-size=1920,2160)
  args << 'headless' if headless
  opts = ::Selenium::WebDriver::Chrome::Options.new(args: args)
  chrome_options = {
    browser: :chrome,
    options: opts,
    clear_local_storage: true,
    clear_session_storage: true,
    desired_capabilities: caps,
    driver_opts: {log_path: 'log/chromedriver.log'}
  }
  Capybara::Selenium::Driver.new(app, chrome_options)
end

Capybara.default_driver = :selenium_headless_chrome
Capybara.javascript_driver = :selenium_headless_chrome

Capybara.save_path = File.absolute_path(File.dirname(File.dirname(__FILE__))) + '/tmp/capybara'

Capybara::Screenshot.prune_strategy = :keep_last_run
Capybara::Screenshot.register_driver(:selenium_headless_chrome) do |driver, path|
  driver.browser.save_screenshot(path)
end
