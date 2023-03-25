class Bookings::OTBookingsStatusUpdater < ApplicationService
  include ApplicationService::ModelMethods

  attributes :external_references

  def execute!
    request_ot_statuses

    if ot_statuses.success?
      result do
        Array(ot_statuses.normalized_response[:job_statuses]).each do |job_status|
          booking = Booking.find(service_id: job_status[:external_reference].strip)
          next if booking.blank?
          next if booking.ot_job_status == job_status[:job_state]

          begin
            update_model(booking, ot_job_status: job_status[:job_state])
          rescue Sequel::NoExistingObject
            # booking was updated during status request. Thus, discarding any results
            # NOTE: this should be the most rare scenario, since there are no external requests
            # happening between fetching a booking and its update - only a couple lines of Ruby code.
            next
          end
        end
      end
    end
  end

  private def request_ot_statuses
    ot_statuses.execute do |on|
      request = Request.new(service_provider: 'ot')

      on.request do
        create_model(request, url: 'job_status', status: :sent)
      end

      on.success do
        update_model(request, response_payload: ot_statuses.normalized_response, status: :processed)
      end
    end
  end

  private def ot_statuses
    @ot_statuses ||= OneTransport::JobStatus.new(external_references: external_references)
  end
end
