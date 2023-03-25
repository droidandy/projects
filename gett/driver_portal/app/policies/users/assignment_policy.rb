module Users
  class AssignmentPolicy < ApplicationPolicy
    def check_in?
      permission?(:checkin_edit) && record.driver?
    end

    def check_identity?
      permission?(:checkin_edit) && record.driver?
    end
  end
end
