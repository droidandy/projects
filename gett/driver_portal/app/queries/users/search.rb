module Users
  class Search < ApplicationQuery
    SORTABLE_COLUMNS = %w[
      phone
      email
      first_name
      last_name
      gett_id
      badge_number
      active
      address
      agent_status
    ].freeze

    base_scope { UserPolicy::Scope.new(current_user, User.all).resolve }

    searchable_by :id, :email, :gett_id

    query_by(:query, :category) { |query, category| scope.filter(query, category) }

    query_by(:role) { |role| scope.joins(:roles).where(roles: { name: role }) }

    query_by(:page, :per_page) do |page, per|
      scope.page(page).per(per)
    end

    sift_by :sort_column, :sort_direction do |column, direction|
      guard { column.to_s.downcase.in?(SORTABLE_COLUMNS) }
      guard { direction.to_s.downcase.in?(%w[asc desc]) }

      base_scope { |scope| scope.order(column => direction) }

      query_by(sort_column: 'active') do
        scope.reorder("blocked_at #{direction}")
      end

      query_by(sort_column: 'address') do
        scope.reorder("city #{direction}, address #{direction}")
      end

      query_by(sort_column: 'agent_status') do
        scope.joins(:agent_status).reorder("agent_statuses.status #{direction}")
      end
    end

    sifter :with_role do
      query_by(:roles) { |roles| scope.joins(:roles).where(roles: { name: roles }) }
    end

    def drivers
      resolved_scope(:with_role, roles: Role::DRIVERS)
    end

    def admins
      resolved_scope(:with_role, roles: Role::ADMINS)
    end

    query_by(in_queue: true) { scope.where.not(ready_for_approval_since: nil) }

    query_by(free_of_approval: true) { scope.where(approver_id: nil) }

    query_by(with_appointment: true) { scope.joins(:reviews).where.not(reviews: { scheduled_at: nil }) }

    query_by(:appointment_from) { |from| scope.joins(:reviews).where('reviews.scheduled_at >= ?', from) }
    query_by(:appointment_to) { |to| scope.joins(:reviews).where('reviews.scheduled_at <= ?', to) }

    query_by(ready_for_assignment: true) do
      scope.joins(:reviews)
        .where.not(reviews: { scheduled_at: nil, checkin_at: nil })
        .where(reviews: { assigned_at: nil })
    end

    query_by(:being_reviewed_by) do |agent_id|
      scope.joins(:reviews).where(reviews: { agent_id: agent_id, training_end_at: nil })
    end
  end
end
