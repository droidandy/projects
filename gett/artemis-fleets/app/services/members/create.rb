module Members
  class Create
    def initialize(user, params)
      @user = user
      @company = user.company
      @params = params
    end

    attr_reader :success, :errors

    def execute!
      return unless action_allowed
      Member.transaction do
        member = @company.members.create!(@params)
        member.reset_password_token!
        MembersMailer.invitation(member.id).deliver_now
      end
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
