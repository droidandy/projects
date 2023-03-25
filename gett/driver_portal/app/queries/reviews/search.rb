module Reviews
  class Search < ApplicationQuery
    base_scope { ReviewPolicy::Scope.new(current_user, Review.all).resolve.chronological }

    query_by(:driver_id) do |driver_id|
      scope.where(driver_id: driver_id)
    end
  end
end
