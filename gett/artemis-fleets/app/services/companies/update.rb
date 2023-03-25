module Companies
  class Update
    def initialize(member, params)
      @company = member.company
      @params = params
    end

    attr_reader :success, :errors

    def execute!
      @company.update!(@params.slice(:logo))
      @success = true
    rescue ActiveRecord::RecordInvalid => e
      @success = false
      @errors = e.record.errors
    end
  end
end
