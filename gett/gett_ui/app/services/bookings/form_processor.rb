# Service for validate/process booking attributes during the creation
#
# @param booking_params [Hash] with booking form attributes
# @return [Hash] with booking form attributes, errors and alerts
#
# Examples:
#
# booking_params = { passenger_id: 1, passenger_name: 'Admin' }
# result = ::Bookings::FormProcessor.new(booking_params: booking_params).execute.result
# result => {
#   booking_params: { },
#   errors: {
#     base: ['some error message'],
#     passenger_name: ['wrong passenger name']
#   },
#   alerts: {
#     base: ['please change name']
#   }
# }
#
module Bookings
  class FormProcessor < ApplicationService
    attributes :company, :booking_params, :vehicles_data

    def execute!
      result = FormProcessors::General.new(booking_params: booking_params).execute.result

      if company.bbc?
        result = FormProcessors::Bbc.new(
          company: company,
          vehicles_data: vehicles_data,
          **result
        ).execute.result
      end

      result
    end

    def valid?
      execute.result[:errors].blank?
    end
  end
end
