module Mobile::V1
  class AddressesController < ApplicationController
    def index
      service = ::Addresses::Index.new(string: params[:string], countries_filter: params[:countries_filter])

      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    def geocode
      service = Mobile::V1::Addresses::Geocode.new(geocode_params.to_h)

      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    def quick_search
      service = Mobile::V1::Addresses::QuickSearch.new(quick_search_params.to_h)

      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    private def geocode_params
      params.permit(
        :lat,
        :lng,
        :string,
        :location_id,
        :google,
        :predefined
      )
    end

    private def quick_search_params
      params.permit(
        :lat,
        :lng,
        :criterion,
        :next_page_token
      )
    end
  end
end
