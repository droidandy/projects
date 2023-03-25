module Admin
  module Companies
    class Destroy
      def initialize(company)
        @company = company
      end

      attr_reader :success, :errors

      def execute!
        @company.destroy
        @success = true
      rescue ActiveRecord::RecordInvalid => e
        @success = false
        @errors = e.record.errors
      end
    end
  end
end
