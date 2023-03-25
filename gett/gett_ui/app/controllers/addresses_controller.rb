class AddressesController < AuthenticatedController
  def index
    service = Addresses::Index.new(string: params[:string], countries_filter: params[:countries_filter])

    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end

  def geocode
    service = Addresses::Geocode.new(
      location_id: params[:location_id],
      string: params[:string],
      google: params[:google],
      predefined: params[:predefined],
      lat: params[:lat],
      lng: params[:lng]
    )

    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end
end
