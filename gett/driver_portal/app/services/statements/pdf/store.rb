module Statements
  module PDF
    class Store < ApplicationService
      attr_reader :statement

      schema do
        required(:statement_id).filled(:int?)
      end

      def execute!
        compose(Statements::PDF::Create.new(current_user, statement_id: statement_id), :pdf_data)
        return unless @pdf_data

        compose(
          Statements::Save.new(current_user, statement_id: statement_id, pdf_data: @pdf_data),
          :statement
        )
        success! if @statement
      end
    end
  end
end
