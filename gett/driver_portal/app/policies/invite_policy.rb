class InvitePolicy < ApplicationPolicy
  def create?
    return true if permission?(:drivers_actions) && record.user.try(:driver?)
    return true if permission?(:users_actions) && record.user.try(:admin?)
    false
  end

  def update?
    record.user_id == current_user.id
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope if permission?(:drivers_actions) || permission?(:users_actions)
      return scope if anonymous?
      scope.where(user: current_user)
    end
  end
end
