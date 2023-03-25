class VehiclePolicy < ApplicationPolicy
  def create?
    current_user.driver? && record.user == current_user
  end

  def update?
    permission?(:alerts_edit) || (current_user.driver? && record.user == current_user)
  end

  def hide?
    current_user.driver? && record.user == current_user
  end

  def set_current?
    current_user.driver? && record.user == current_user
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.visible if permission?(:alerts_view)
      scope.where(user: current_user).visible
    end
  end
end
