module Locations
  class Show < ApplicationService
    attributes :location

    def execute!
      location.as_json(
        only: [:id, :name, :pickup_message, :destination_message, :default, :created_at],
        include: [:address]
      )
    end
  end
end
