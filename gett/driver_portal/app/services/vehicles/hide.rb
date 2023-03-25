class Vehicles::Hide < ApplicationService
  schema do
    required(:vehicle_id).filled(:int?)
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless vehicle

    authorize! @vehicle

    return fail!(errors: { base: 'At least one vehicle should remain' }) if current_user.vehicles.visible.count == 1

    super do
      @vehicle.update(hidden: true)
    end
  end

  on_fail { errors!(vehicle.errors.to_h) if vehicle.present? }

  def vehicle
    @vehicle ||= begin
      search = Vehicles::Search.new({ id: vehicle_id }, current_user: current_user)
      search.one
    end
  end
end
