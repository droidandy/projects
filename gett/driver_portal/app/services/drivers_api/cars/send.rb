class DriversApi::Cars::Send < ApplicationService
  schema do
    required(:vehicle).filled
  end

  def execute!
    super do
      vehicle.update!(gett_id: car_id)

      compose(DriversApi::Cars::Assign.new(current_user, vehicle: vehicle))
    end
  end

  on_fail { errors!(record.errors.to_h) if record.present? }

  def car_id
    @car_id ||= existing_car_id || created_car_id
  end

  private def existing_car_id
    compose(DriversApi::Cars::Search.new(current_user, license: vehicle.plate_number), :car_id, as: nil)
  end

  private def created_car_id
    compose(DriversApi::Cars::Create.new(current_user, vehicle: vehicle), :car_id, as: nil)
  end
end
