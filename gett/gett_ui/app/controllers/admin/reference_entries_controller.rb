class Admin::ReferenceEntriesController < AuthenticatedController
  def index
    render json: Admin::ReferenceEntries::Index.new(query: query_params).execute.result
  end

  private def query_params
    params.permit(:booking_reference_id, :search_term)
  end
end
