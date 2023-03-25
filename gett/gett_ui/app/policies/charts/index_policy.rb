module Charts
  class IndexPolicy < ServicePolicy
    def execute?
      execute_charts_service? || member.executive? || member.travelmanager?
    end

    # This policy is also used by other policies, such as Sessions::CurrentPolicy, and
    # in this case service object is of different class.
    # Also, executing this service Dashboard should omit any policy checks, since
    # DashboardPolicy with it's own checks has more priority.
    private def execute_charts_service?
      service.is_a?(::Charts::Index) && service.for_dashboard
    end
  end
end
