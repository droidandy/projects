module Bookings
  class PriceUpdater < ApplicationService
    include ::ApplicationService::ModelMethods

    attributes :booking, :params

    def execute!
      return if params.blank?

      save_model(booking, params)
    end
  end
end
