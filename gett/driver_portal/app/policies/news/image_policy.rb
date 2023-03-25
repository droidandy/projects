module News
  class ImagePolicy < ApplicationPolicy
    class Scope < ApplicationPolicy::Scope
      def resolve
        return scope if permission?(:news_edit)
        scope.none
      end
    end
  end
end
