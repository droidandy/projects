module Documents
  module Kinds
    class Show < ApplicationPresenter
      attr_reader :kind

      COLUMNS_TO_SHOW = %i[
        id
        title
        slug
        mandatory
        owner
      ].freeze

      def initialize(kind)
        @kind = kind
      end

      def as_json(with_fields: false)
        convert_to_json(kind, only: COLUMNS_TO_SHOW) do |json|
          json[:fields] = kind.fields.map { |field| presenter_for(field).as_json } if with_fields
        end
      end
    end
  end
end
