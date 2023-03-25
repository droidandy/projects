module Invites
  class Search < ApplicationQuery
    base_scope { InvitePolicy::Scope.new(current_user, Invite.all).resolve }

    searchable_by :user

    query_by(:digest) { |digest| scope.where(token_digest: digest) }
    query_by(active: true) { scope.where(expires_at: nil).where(accepted_at: nil) }
    query_by(accepted: true) { scope.where.not(accepted_at: nil).where(step: :accepted) }
    query_by(:accepted_after) { |datetime| scope.where('accepted_at > ?', datetime) }
    query_by(:accepted_before) { |datetime| scope.where('accepted_at < ?', datetime) }
  end
end
