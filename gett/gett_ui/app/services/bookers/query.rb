module Bookers
  class Query < Shared::Members::Query
    defaults per_page: 10, order: 'id'

    query_by(:role) do |roles|
      guard { roles.all?{ |role| role.in? %w(admin booker finance travelmanager) } }

      roles.push('companyadmin') if roles.include?('admin')
      scope.where(member_role_id: roles.map{ |r| Role[r].id })
    end
  end
end
