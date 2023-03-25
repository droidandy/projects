module News
  class ItemPolicy < ApplicationPolicy
    def create?
      permission?(:news_edit)
    end

    def update?
      permission?(:news_edit)
    end

    def destroy?
      permission?(:news_edit)
    end

    class Scope < ApplicationPolicy::Scope
      def resolve
        return scope if permission?(:news_view)
        return scope.none if anonymous?
        scope.published
      end
    end
  end
end
