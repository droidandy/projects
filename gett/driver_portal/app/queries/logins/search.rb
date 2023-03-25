module Logins
  class Search < ApplicationQuery
    base_scope { Login.all }

    query_by(:created_between) { |from, till| scope.where('created_at between ? AND ?', from, till) }
  end
end
