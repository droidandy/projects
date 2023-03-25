module Booking::SplytExtension
  extend ActiveSupport::Concern

  included do
    plugin :custom_attributes, attributes: [
      :region_id,
      :estimate_id,
      :supplier,
      :supports_flight_number,
      :supports_driver_message,
      :message_from_supplier,
      :otp_code
    ]
  end

  def validate
    super
    return unless splyt?

    validates_presence(:region_id)
    validates_presence(:estimate_id)
  end
end
