module Documents
  module Kinds
    class Search < ApplicationQuery
      base_scope { Documents::KindPolicy::Scope.new(current_user, Documents::Kind.all).resolve }

      searchable_by :owner, :mandatory
    end
  end
end
