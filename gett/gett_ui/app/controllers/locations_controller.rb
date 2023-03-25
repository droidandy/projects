class LocationsController < ApplicationController
  def index
    render json: Locations::Index.new.execute.result
  end

  def default
    service = Locations::Default.new(location: location)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def create
    service = Locations::Create.new(params: location_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Locations::Update.new(location: location, params: location_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Locations::Destroy.new(location: location)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def location
    @location ||= current_company.locations_dataset.with_pk!(params[:id])
  end

  private def location_params
    params
      .require(:location)
      .permit(
        :id,
        :name,
        :pickup_message,
        :destination_message,
        address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region]
      )
  end
end
