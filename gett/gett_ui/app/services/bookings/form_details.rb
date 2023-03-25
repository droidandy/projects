module Bookings
  class FormDetails < ApplicationService
    include ApplicationService::Context

    attributes :data_params, :booking_params

    delegate :company, to: :context

    def execute!
      Shared::Bookings::FormDetails.new(
        company: company,
        data_params: data_params,
        booking_params: booking_params,
        allow_personal_cards: false,
        include_vehicle_vendor_options: true
      ).execute.result
    end
  end
end
