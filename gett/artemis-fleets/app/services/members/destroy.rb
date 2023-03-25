module Members
  class Destroy
    def initialize(user, member_id)
      @user = user
      @company = user.company
      @member_id = member_id
    end

    attr_reader :success, :errors

    def execute!
      return unless action_allowed
      member = @company.members.find(@member_id)
      member.destroy
      @success = true
    rescue ActiveRecord::RecordInvalid => e
      @success = false
      @errors = e.record.errors
    end

    private def action_allowed
      return true if @user.admin?
      @error = 'permission denied'
      @success = false
    end
  end
end
