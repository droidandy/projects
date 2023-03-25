class DocumentPolicy < ApplicationPolicy
  def create?
    return false if anonymous?
    return false unless current_user.driver?
    return false if record.vehicle && record.vehicle.user != current_user # rubocop:disable Style/SafeNavigation
    record.user == current_user
  end

  def approve?
    permission?(:alerts_edit)
  end

  def reject?
    permission?(:alerts_edit)
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.visible if permission?(:alerts_view)
      scope.where(user: current_user).visible
    end
  end
end
