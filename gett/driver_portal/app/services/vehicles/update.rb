# TODO hidden vehicles update
class Vehicles::Update < ApplicationService
  attr_reader :updated_vehicle

  schema do
    required(:vehicle_id).filled(:int?)
    optional(:title).maybe(:str?)
    optional(:model).maybe(:str?)
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless vehicle

    authorize! vehicle

    super do
      vehicle.update(attributes)
    end
  end

  on_success { @updated_vehicle = vehicle }
  on_fail { errors!(vehicle.errors.to_h) if vehicle.present? }

  def vehicle
    @vehicle ||= begin
      search = Vehicles::Search.new({ id: vehicle_id }, current_user: current_user)
      search.one
    end
  end

  private def attributes
    {
      title: title,
      model: model
    }.reject { |_, v| v.nil? }
  end
end
