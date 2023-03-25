module Admin
  module Companies
    class ToggleStatus
      def initialize(company)
        @company = company
      end

      def execute!
        @company.toggle!(:active)
      end
    end
  end
end
