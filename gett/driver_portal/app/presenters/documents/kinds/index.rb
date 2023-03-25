module Documents
  module Kinds
    class Index < ApplicationPresenter
      attr_reader :kinds

      def initialize(kinds)
        @kinds = kinds
      end

      def as_json(with_fields: false)
        {
          kinds: kinds.map { |kind| presenter_for(kind).as_json(with_fields: with_fields) }
        }
      end
    end
  end
end
