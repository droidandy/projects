using Sequel::CoreRefinements

module Mobile::V1
  module Statistics
    class Query < Shared::Statistics::Query
      sift_by(:top) do
        query_by(top: 'passengers') do
          scope.association_join(:passenger.as(:top))
        end

        query_by(top: 'bookers') do
          scope
            .join(:members, id: :booker_id, company_id: :company[:id])
            .association_join(:booker.as(:top))
        end

        query do
          scope
            .group_by(:top[:id], :top[:first_name], :top[:last_name])
            .order{ count('*').desc }
            .limit(10)
            .select(:top[:id], :top[:first_name], :top[:last_name], Sequel.function(:count, '*'))
        end
      end
    end
  end
end
