module Documents
  class Search < ApplicationQuery
    base_scope { DocumentPolicy::Scope.new(current_user, Document.all).resolve }

    searchable_by :id,
      :approval_status,
      :hidden,
      :kind,
      :user_id,
      :user,
      :vehicle_id,
      :vehicle

    query_by(:except_id) { |id| scope.where.not(id: id) }
    query_by(driver_bound: true) { scope.where(vehicle_id: nil) }
    query_by(:required) { |required| scope.includes(:kind).where('documents_kinds.mandatory' => required) }
    query_by(expiring: true) { scope.where(expires_at: Time.current..Document::EXPIRATION_THRESHOLD.from_now) }
    query_by(expired: true) { scope.where('expires_at < ?', Time.current) }
  end
end
