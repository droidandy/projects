require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'spec/samples/vcr'
  config.hook_into :webmock
end
