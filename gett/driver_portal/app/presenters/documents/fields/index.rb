module Documents
  module Fields
    class Index < ApplicationPresenter
      attr_reader :fields

      def initialize(fields)
        @fields = fields
      end

      def as_json
        {
          fields: fields.map { |field| presenter_for(field).as_json }
        }
      end
    end
  end
end
