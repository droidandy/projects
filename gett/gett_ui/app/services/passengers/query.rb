module Passengers
  class Query < Shared::Members::Query
    defaults per_page: 10, order: 'first_name'
  end
end
