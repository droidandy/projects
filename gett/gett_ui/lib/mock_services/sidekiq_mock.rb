if defined?(Rails) && !Rails.env.production?
  if defined?(Sidekiq)
    Sidekiq::Scheduler.enabled = false
    module Mocks
      module Sidekiq
        class ClientMiddleware
          def call(_worker_class, job, _queue, _redis_pool)
            job[:mocks] = RequestStore.store[:x_mock_data] if RequestStore.store[:x_mock_data].present?

            yield
          end
        end

        class ServerMiddleware
          def call(worker, job, _queue)
            return yield if job['mocks'].blank?

            with_mock_data(job['mocks']) do
              Rails.logger.error "MOCKS: Performing job for #{worker} with #{RequestStore.store[:x_mock_data]}"
              yield
            end
          end

          private def with_mock_data(data)
            old_data = RequestStore.store[:x_mock_data]
            RequestStore.store[:x_mock_data] = data.with_indifferent_access
            yield
          ensure
            RequestStore.store[:x_mock_data] = old_data
          end
        end
      end
    end

    ::Sidekiq.configure_client do |config|
      config.client_middleware do |chain|
        chain.add Mocks::Sidekiq::ClientMiddleware
      end
    end

    ::Sidekiq.configure_server do |config|
      config.server_middleware do |chain|
        chain.add Mocks::Sidekiq::ServerMiddleware
      end

      config.client_middleware do |chain|
        chain.add Mocks::Sidekiq::ClientMiddleware
      end
    end
  end
end
