module Vehicles
  class Create < ApplicationService
    attr_reader :vehicle

    schema do
      required(:title).filled(:str?)
    end

    def execute!
      @vehicle = current_user.vehicles.build(attributes)

      authorize! @vehicle

      success! if @vehicle.save
    end

    private def attributes
      {
        title: title
      }
    end

    on_fail { errors!(vehicle.errors.to_h) if vehicle.present? }
  end
end
