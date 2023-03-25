module Passengers
  class AuditLog < Shared::Members::AuditLog
    include ApplicationService::Context
    include ApplicationService::Policy
    include HomePrivacy::AuditLogExtension

    attributes :passenger

    alias member passenger

    def self.policy_class
      Passengers::ShowPolicy
    end
  end
end
