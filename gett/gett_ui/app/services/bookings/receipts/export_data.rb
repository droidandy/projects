module Bookings
  # "Export" in "ExportData" is an adjective, i.e. service fetches data for
  # subsequent export, it does not export data.
  class Receipts::ExportData < ApplicationService
    include ApplicationService::Context

    def execute!
      {
        periods: Bookings::Receipts::ExportablePeriods.new.execute.result[:items],
        passengers: passengers_data
      }
    end

    private def passengers_data
      Passengers::IndexPolicy.scope[context.member]
        .all
        .map{ |m| {id: m.id, full_name: m.full_name} }
    end
  end
end
