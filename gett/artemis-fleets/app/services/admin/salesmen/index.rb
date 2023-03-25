module Admin
  module Salesmen
    class Index
      attr_reader :result

      def execute!
        @result = Salesman.all
      end
    end
  end
end
