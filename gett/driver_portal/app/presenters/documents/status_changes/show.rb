module Documents
  module StatusChanges
    class Show < ApplicationPresenter
      attr_reader :status_change

      COLUMNS_TO_SHOW = %i[
        comment
        created_at
        status
        user_id
      ].freeze

      def initialize(status_change)
        @status_change = status_change
      end

      def as_json
        convert_to_json(status_change, only: COLUMNS_TO_SHOW) do |json|
          json[:user_name] = status_change.user.name
        end
      end
    end
  end
end
