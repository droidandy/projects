# Base class for booking form processing
#
# @param booking_params [Hash] with booking form attributes
# @param errors [Hash optional] with the current errors
# @param alerts [Hash optional] with the current alerts
# @return [Hash] with booking form attribute, errors, alerts
#
# Examples:
#
# module Bookings::FormProcessors
#   class Special < Base
#     def execute!
#       unless booking_params[:user_name].present?
#         add_error(:user_name, 'user name required')
#         add_error('form is invalid')
#       end
#
#       {
#         booking_params: booking_params,
#         errors: errors,
#         alerts: alerts
#       }
#     end
#   end
# end
#
module Bookings::FormProcessors
  class Base < ApplicationService
    attributes :company, :booking_params, :errors, :alerts, :metadata

    def initialize(booking_params: {}, errors: {}, alerts: {}, metadata: {}, **)
      super
    end

    def execute!
      {
        booking_params: booking_params,
        alerts: alerts,
        errors: errors,
        metadata: metadata
      }
    end

    private def add_error(key, message)
      errors[key] ||= []
      errors[key] << message
    end

    private def add_alert(key, message)
      alerts[key] ||= []
      alerts[key] << message
    end

    private def passenger
      return @passenger if defined?(@passenger)

      @passenger = company.members_dataset.with_pk(booking_params[:passenger_id])
    end

    private def scheduled_at
      @scheduled_at ||=
        booking_params[:scheduled_at]&.to_time || (Time.current + Bookings::ASAP_DELAY)
    end
  end
end
