require 'mock_services/vcr'
require 'mock_services/mock_data'
require 'mock_services/sidekiq_mock'

# For all controllers add around hook if X-Mock-Data header present
ActiveSupport.on_load(:action_controller) do
  include MockServices::MockData

  around_action MockServices::MockData::XMockData, if: :mock_data_enabled?
end
