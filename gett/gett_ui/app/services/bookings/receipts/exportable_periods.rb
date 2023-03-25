module Bookings
  class Receipts::ExportablePeriods < ::Shared::ExportablePeriods
    def self.policy_class
      Bookings::IndexPolicy
    end

    private def objects_dataset
      Bookings::IndexPolicy.scope[context.member].billed
    end

    private def timestamp_column
      :scheduled_at
    end
  end
end
