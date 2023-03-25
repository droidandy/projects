module Vehicles
  class Search < ApplicationQuery
    base_scope { VehiclePolicy::Scope.new(current_user, Vehicle.all).resolve }

    searchable_by :id, :approval_status, :hidden, :is_current, :user, :user_id

    query_by(:except_id) { |id| scope.where.not(id: id) }
    query_by(filled_documents: true) { scope.where.not(approval_status: 'documents_missing') }
  end
end
