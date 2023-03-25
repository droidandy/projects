class ApplicationPolicy
  attr_reader :current_user, :record

  def initialize(current_user, record)
    @current_user = current_user
    @record = record
  end

  def show?
    false
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  def scope
    Pundit.policy_scope!(current_user, record.class)
  end

  def anonymous?
    current_user.blank?
  end

  def authenticated?
    current_user.present?
  end

  def admin?
    authenticated? && current_user.has_role?(:site_admin)
  end

  def system?
    authenticated? && current_user.has_role?(:system_admin)
  end

  def permission?(permission)
    authenticated? && current_user.permissions.exists?(slug: permission)
  end

  class Scope
    attr_reader :current_user, :scope

    def initialize(current_user, scope)
      @current_user = current_user
      @scope = scope
    end

    def authenticated?
      current_user.present?
    end

    def anonymous?
      current_user.blank?
    end

    def admin?
      authenticated? && current_user.has_role?(:site_admin)
    end

    def system?
      authenticated? && current_user.has_role?(:system_admin)
    end

    def permission?(permission)
      authenticated? && current_user.permissions.exists?(slug: permission)
    end

    def resolve
      scope
    end
  end
end
