module Statements
  module PDF
    class Create < ApplicationService
      attr_reader :pdf_data

      schema do
        required(:statement_id).filled(:int?)
      end

      def execute!
        compose(Statements::GetHTML.new(current_user, statement_id: statement_id), :html)
        return unless @html

        @pdf_data = convert_to_pdf
        success! if @pdf_data
      end

      private def convert_to_pdf
        WickedPdf.new.pdf_from_string(@html, orientation: 'Landscape') if @html
      end
    end
  end
end
