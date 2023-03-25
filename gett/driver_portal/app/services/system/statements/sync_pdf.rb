module System
  module Statements
    class SyncPDF < ApplicationService
      LAST_SYNC_KEY = 'statements_synced_at'.freeze

      def execute!
        @started_at = Time.current

        (1..config.sample_pages).each do |page|
          service = get_batch(page)
          if !service.success?
            fail!(errors: service.errors)
            return # rubocop:disable Lint/NonLocalExitFromIterator
          elsif service.statements_ids.any?
            process_batch!(service.statements_ids)
          else
            break
          end
        end

        success!
      end

      on_success :save_sync_event

      private def process_batch!(statements_ids)
        statements_ids.each do |statement_id|
          compose(
            ::Statements::PDF::Store.new(current_user, statement_id: statement_id),
            :statement,
            as: nil
          )
        end
      end

      private def get_batch(page)
        service = ::Statements::ForSync.new(
          current_user,
          changed_after: last_sync,
          per_page: config.batch_size,
          page: page
        )
        service.execute!
        service
      end

      private def config
        OpenStruct.new(
          Settings.sync_statements
        )
      end

      private def save_sync_event
        redis.set(LAST_SYNC_KEY, @started_at)
      end

      private def last_sync
        redis.get(LAST_SYNC_KEY)
      end

      private def redis
        Redis.new
      end
    end
  end
end
