module Shared::PassengerAddressesController
  def create
    service = PassengerAddresses::Create.new(passenger: passenger, params: passenger_address_params)

    if service.execute.success?
      render json: service.as_json
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = PassengerAddresses::Update.new(passenger_address: passenger_address, params: passenger_address_params)

    if service.execute.success?
      render json: service.as_json
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = PassengerAddresses::Destroy.new(passenger_address: passenger_address)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private def passenger_address
    @passenger_address ||= passenger.passenger_addresses_dataset.with_pk!(params[:id])
  end

  private def passenger_address_params
    params
      .require(:passenger_address)
      .permit(:name, :type, :pickup_message, :destination_message, address: [:line, :lat, :lng, :postal_code, :country_code, :city, :region])
  end
end
