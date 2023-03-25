namespace :requests do
  task update: :environment do
    ActiveRecord::Base.logger = nil

    requests = [
      CurrentWeekDriverReportRequest,
      PreviousWeekDriverReportRequest,
      FleetReportRequest
    ]

    fleet_ids = Company.pluck(:fleet_id).uniq.compact

    requests.each do |request|
      fleet_ids.each do |fleet_id|
        request.new(fleet_id, force_update: true).execute
      end
    end
  end
end
