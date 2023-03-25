module Statements
  module PDF
    class Get < ApplicationService
      attr_reader :pdf_data

      schema do
        required(:statement_id).filled(:int?)
      end

      def execute!
        return unless statement
        @pdf_data = statement.pdf.read
        success! if @pdf_data
      end

      private def statement
        @statement ||= saved_statement || created_statement
      end

      private def saved_statement
        Statement.find_by(external_id: statement_id)
      end

      private def created_statement
        compose(
          Statements::PDF::Store.new(current_user, statement_id: statement_id),
          :statement,
          as: nil
        )
      end
    end
  end
end
