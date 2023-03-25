require 'mock_services/thread_mutator'
require 'mock_services/fiber_mutator'

module MockServices
  module MockData
    private def mock_data_enabled?
      mock_data = request.headers['X-Mock-Data'].present?
      enabled_env = %w[development test test_features].include?(Rails.env)
      mock_data && enabled_env
    end

    class XMockData
      class << self
        def around(controller)
          with_new_thread do
            if controller.request.headers['X-Mock-Data'].present?
              # For some reason proxy returns X-Mock-Data encoded as ASCII-8BIT but it is actually ISO8859-1
              json = controller.request.headers['X-Mock-Data'].force_encoding('ISO8859-1').encode('utf-8')
              set_request_store(json)
            end
            begin
              yield
            ensure
              reset_request_store!
            end
          end
        end

        private def set_request_store(json) # rubocop:disable Naming/AccessorMethodName
            RequestStore.store[:x_mock_data] = JSON.parse(json, symbolize_names: true)
        rescue JSON::ParserError => e
          Rails.logger.warn "Failed to parse JSON for X-Mock-Data header #{json}: #{e.message}"
        ensure
          Rails.logger.info "X mock data enabled for this request and set to #{RequestStore.store[:x_mock_data]}"
        end

        private def reset_request_store!
          RequestStore.store[:x_mock_data] = nil
        end

        private def with_new_thread
          ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
            # Make sure we modify request store only for this request
            Thread.new do
              yield
            end.join
          end
        end
      end
    end
  end
end
