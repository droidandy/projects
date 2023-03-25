module Documents
  module Fields
    class Show < ApplicationPresenter
      attr_reader :field

      COLUMNS_TO_SHOW = %i[
        label
        mandatory
        name
      ].freeze

      def initialize(field)
        @field = field
      end

      def as_json
        convert_to_json(field, only: COLUMNS_TO_SHOW) do |json|
          json[:type] = field.field_type
        end
      end
    end
  end
end
