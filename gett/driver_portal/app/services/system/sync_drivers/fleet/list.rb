module System
  module SyncDrivers
    module Fleet
      class List < Base
        def execute!
          (1..config.sample_pages).each do |page|
            current_batch = get_batch(page)
            if !current_batch.success?
              fail!
              break
            elsif current_batch.drivers.empty?
              break
            else
              process_batch!(current_batch.drivers)
            end
          end

          success!
        end

        private def process_batch!(drivers)
          drivers.each do |driver_data|
            process_driver!(driver_data)
          end
        end

        private def get_batch(page)
          service = Drivers::Fleet::List.new(
            current_user,
            fields: FIELDS,
            page: page,
            per: config.batch_size
          )
          service.execute!
          service
        end

        private def config
          OpenStruct.new(
            Settings.sync_drivers
          )
        end
      end
    end
  end
end
