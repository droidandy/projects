module Admin::Members
  class AuditLog < Shared::Members::AuditLog
    attributes :member
  end
end
