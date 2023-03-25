class Admin::PredefinedAddressesController < Admin::BaseController
  def index
    render json: Admin::PredefinedAddresses::Index.new(query: query_params).execute.result
  end

  def validate_postal_code
    service = Admin::PredefinedAddresses::PostalCodeValidator.new(postal_code: params[:postal_code])

    if service.execute.success?
      head :ok
    else
      head :not_found
    end
  end

  def create
    service = Admin::PredefinedAddresses::Create.new(params: predefined_address_params)

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    service = Admin::PredefinedAddresses::Update.new(
      predefined_address: predefined_address,
      params: predefined_address_params
    )

    if service.execute.success?
      render json: service.show_result
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    service = Admin::PredefinedAddresses::Destroy.new(predefined_address: predefined_address)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def predefined_address_params
    params.require(:predefined_address).permit(:line, :lat, :lng, :additional_terms, :postal_code, :city, :region, :street_name, :street_number, :point_of_interest)
  end

  private def predefined_address
    @predefined_address ||= PredefinedAddress.with_pk!(params[:id])
  end

  private def query_params
    params.permit(:page, :per_page, :order, :reverse, :search)
  end
end
