module Admin
  module Companies
    class Index
      attr_reader :result

      def execute!
        @result = Company.order(:id).all
      end
    end
  end
end
