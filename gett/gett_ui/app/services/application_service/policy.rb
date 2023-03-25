module ApplicationService::Policy
  extend ActiveSupport::Concern

  delegate :execute?, to: :policy
  delegate :scope, to: :policy, prefix: true

  def execute(*)
    fail ApplicationService::NotAuthorizedError unless execute?

    if defined?(super)
      super
    else
      block_given? ? execute!(&Proc.new) : execute!
    end
  end

  private def policy
    @policy ||= policy_class.new(policy_user, self)
  end

  private def policy_class
    self.class.policy_class
  end

  private def policy_user
    # At the moment of writing, policies are used only in app-related services, which are
    # bounded to specific company `member`. Ideally, all such services should be inherited
    # from base service that would have overloaded `#policy_user` method. We still need
    # `user` as a fallback, since it's what is set to :system in non-web processes. --akuzko 2017-05-04
    try(:context)&.member || try(:context)&.user || try(:context)&.admin ||
      fail("Unable to fetch policy user. Please use context feature or overload #policy_user method")
  end

  module ClassMethods
    def policy_class
      "#{name}Policy".constantize
    end
  end
end
