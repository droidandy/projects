require 'mock_services/base'
require 'mock_services/google_maps'
require 'mock_services/flightstats'
require 'mock_services/open_exchange'
require 'mock_services/nexmo'
require 'mock_services/experian'
require 'mock_services/paymentsos'

require 'mock_services/one_transport'
require 'mock_services/gett'
require 'mock_services/via'
require 'mock_services/get_e'
require 'mock_services/carey'

# Configure VCR to use around hook from MockServices::Base
VCR.configure do |c|
  c.hook_into :webmock
  c.cassette_library_dir = './spec/cassettes'
  c.around_http_request(&MockServices::Base.method(:around_hook))
  c.allow_http_connections_when_no_cassette = true
  c.ignore_localhost = true
end
