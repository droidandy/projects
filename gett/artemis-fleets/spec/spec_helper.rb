ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'
require 'pry'

require_relative 'helpers/controller_helpers'

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
    FactoryGirl.lint
    DatabaseCleaner.clean_with(:truncation)
  end
  config.order = :random
  config.infer_spec_type_from_file_location!
  config.use_transactional_fixtures = true
  config.include FactoryGirl::Syntax::Methods
  config.include ControllerHelpers, type: :controller
end
