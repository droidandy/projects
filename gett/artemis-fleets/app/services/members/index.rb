module Members
  class Index
    def initialize(user)
      @user = user
      @company = user.company
    end

    attr_reader :result

    def execute!
      if @user.admin?
        @result = @company.members
      else
        @result = [@user.reload]
      end
    end
  end
end
