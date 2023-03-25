class ReviewPolicy < ApplicationPolicy
  def start?
    permission?(:drivers_actions)
  end

  def approve?
    permission?(:drivers_actions)
  end

  alias reject? approve?
  alias approve_item? approve?
  alias reject_item? approve?
  alias stop? approve?

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope if permission?(:review_view)
      scope.where(driver: current_user)
    end
  end
end
