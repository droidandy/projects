module Statements
  module PDF
    class Send < ApplicationService
      schema do
        optional(:statements_ids).filled(:array?)
      end

      def execute!
        compose(Statements::CreateZIP.new(current_user, statements_ids: statements_ids), :zip_data)
        return unless @zip_data

        StatementsMailer.report(current_user, @zip_data).deliver_now
        success!
      end
    end
  end
end
