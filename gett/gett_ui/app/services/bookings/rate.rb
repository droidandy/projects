module Bookings
  class Rate < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include Notificator::Concern

    RATEABLE_STATUSES = %w(on_the_way arrived in_progress completed).freeze
    private_constant :RATEABLE_STATUSES

    delegate :driver, to: :booking
    attributes :booking, :params

    def self.policy_class
      Bookings::ShowPolicy
    end

    def execute!
      return unless booking_rateable?

      notify_on_update do
        result { update_model(driver, driver_params) }
      end
    end

    def booking_rateable?
      booking.status.in?(RATEABLE_STATUSES) && driver.present? && driver.trip_rating.nil?
    end

    private def driver_params
      {
        trip_rating: params[:rating]
      }.tap do |h|
        h[:rating_reasons] = params[:rating_reasons] if params[:rating_reasons].present?
      end
    end
  end
end
