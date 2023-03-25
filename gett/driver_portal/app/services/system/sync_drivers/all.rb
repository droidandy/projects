require 'sync_manager'

module System
  module SyncDrivers
    class All < ApplicationService
      def execute!
        SyncManager.sync_started!

        fleet_service = System::SyncDrivers::Fleet::List.new(current_user)
        fleet_service.execute!
        fleet_service.success? ? success! : fail!
      end

      on_success { SyncManager.sync_succeeded! }
      on_fail { SyncManager.sync_failed! }
    end
  end
end
