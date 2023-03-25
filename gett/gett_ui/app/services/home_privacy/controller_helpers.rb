module HomePrivacy
  module ControllerHelpers
    private def restore_address_params!(params)
      return if params&.dig(:id).blank?

      address = Address.with_pk!(params[:id])
      params.merge!(address.as_json(only: [:postal_code, :lat, :lng, :line, :country_code, :timezone, :city]))
    end
  end
end
