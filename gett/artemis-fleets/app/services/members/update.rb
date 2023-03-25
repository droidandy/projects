module Members
  class Update
    def initialize(user, member_id, params)
      @user = user
      @company = user.company
      @member_id = member_id
      @params = params
    end

    attr_reader :success, :result, :errors

    def execute!
      return unless action_allowed
      member = @company.members.find(@member_id)
      member.update!(@params)
      @success = true
      @result = member
    rescue ActiveRecord::RecordInvalid => e
      @success = false
      @errors = e.record.errors
    end

    private def action_allowed
      return true if @user.admin? || @user.id == @member_id.to_i
      @error = 'permission denied'
      @success = false
    end
  end
end
