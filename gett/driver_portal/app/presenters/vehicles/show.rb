module Vehicles
  class Show < ApplicationPresenter
    attr_reader :vehicle

    COLUMNS_TO_SHOW = %i[
      id
      user_id
      approval_status
      color
      is_current
      model
      plate_number
      title
    ].freeze

    def initialize(vehicle, current_user)
      @vehicle = vehicle
      @current_user = current_user
    end

    def as_json(with_documents: true)
      convert_to_json(vehicle, only: COLUMNS_TO_SHOW) do |json|
        json[:documents] = ::Documents::GroupedIndex.new(documents).as_json[:documents] if with_documents
      end
    end

    private def documents
      @documents ||= begin
        service = ::Documents::VehicleList.new(@current_user, vehicle_id: vehicle.id)
        service.execute!
        service.documents
      end
    end
  end
end
