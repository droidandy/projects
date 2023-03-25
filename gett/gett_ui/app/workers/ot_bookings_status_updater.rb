class OTBookingsStatusUpdater < ApplicationWorker
  BATCH_SIZE = 50

  sidekiq_options queue: :default, retry: false

  def perform
    external_references = Booking.ot.fully_created.not_final.pluck(:service_id).compact

    external_references.in_groups_of(BATCH_SIZE, false) do |batch|
      Bookings::OTBookingsStatusUpdater.new(external_references: batch).execute
    end
  end
end
