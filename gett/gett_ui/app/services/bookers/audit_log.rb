module Bookers
  class AuditLog < Shared::Members::AuditLog
    include ApplicationService::Context
    include ApplicationService::Policy
    include HomePrivacy::AuditLogExtension
    include HomePrivacy::ServiceHelpers

    attributes :booker

    alias member booker

    def self.policy_class
      Bookers::ShowPolicy
    end

    def skip_sanitize_home_address?
      context.member&.id == booker.id
    end
  end
end
