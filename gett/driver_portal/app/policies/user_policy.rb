class UserPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.none if anonymous?
      return scope.joins(:roles).where(roles: { name: available_user_roles }) if available_user_roles.any?
      scope.where(id: current_user.id)
    end

    private def available_user_roles
      @available_user_roles ||= begin
        roles = []
        roles.concat(Role::DRIVERS) if permission?(:drivers_view)
        roles.concat(Role::ADMINS) if permission?(:users_view)
        roles.concat(Role::ONBOARDING_AGENTS) if permission?(:checkin_view)
        roles.uniq
      end
    end
  end

  def create?
    permission?(:users_edit)
  end

  def update?
    permission?(:users_edit)
  end

  def activate?
    return true if record.driver? && permission?(:drivers_actions)
    return true if record.admin? && permission?(:users_actions)
    false
  end

  def deactivate?
    return true if record.driver? && permission?(:drivers_actions)
    return true if record.admin? && permission?(:users_actions)
    false
  end

  def log_in_as?
    record.driver? && permission?(:drivers_actions)
  end

  def pick_for_approval?
    permission?(:alerts_edit) && record.driver?
  end

  def upload_avatar?
    permission?(:users_actions) && record.driver?
  end

  def change_status?
    record.onboarding_agent?
  end
end
