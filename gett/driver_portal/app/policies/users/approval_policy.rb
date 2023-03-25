module Users
  class ApprovalPolicy < ApplicationPolicy
    def pick?
      permission?(:alerts_edit) && record.driver?
    end

    def drop?
      permission?(:alerts_edit) && record.driver?
    end

    def finish?
      permission?(:alerts_edit) && record.driver? && record.approver == current_user
    end

    def start?
      permission?(:alerts_edit) && record.driver?
    end
  end
end
