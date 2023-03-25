class Vehicles::SetCurrent < ApplicationService
  attr_reader :record

  schema do
    required(:vehicle_id).filled(:int?)
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless vehicle

    authorize! vehicle

    super do
      current_vehicles.each { |vehicle| vehicle.update is_current: false }
      vehicle.update(is_current: true)

      compose(DriversApi::Cars::SetCurrent.new(current_user, vehicle: vehicle))
    end
  end

  def vehicle
    @vehicle ||= begin
      search = Vehicles::Search.new({ id: vehicle_id }, current_user: current_user)
      search.one
    end
  end

  def current_vehicles
    search = Vehicles::Search.new({ is_current: true, except_id: vehicle_id }, current_user: current_user)
    search.resolved_scope
  end
end
