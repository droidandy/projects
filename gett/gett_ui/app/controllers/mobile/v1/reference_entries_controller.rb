module Mobile::V1
  class ReferenceEntriesController < ApplicationController
    def index
      render json: ::ReferenceEntries::Index.new(query: query_params).execute.result
    end

    private def query_params
      params.permit(:booking_reference_id, :search_term)
    end
  end
end
