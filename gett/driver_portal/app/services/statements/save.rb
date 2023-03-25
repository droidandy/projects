module Statements
  class Save < ApplicationService
    attr_reader :statement

    schema do
      required(:statement_id).filled(:int?)
      required(:pdf_data).filled(:str?)
    end

    def execute!
      @statement = Statement.find_or_initialize_by(external_id: statement_id)
      write_pdf
      @statement.pdf = pdf_tempfile
      @statement.save ? success! : fail!
    ensure
      pdf_tempfile.close
      pdf_tempfile.unlink
    end

    on_fail { errors!(@statement.errors) }

    private def write_pdf
      File.open(pdf_tempfile.path, 'wb') do |file|
        file << pdf_data
      end
    end

    private def pdf_tempfile
      @pdf_tempfile ||= Tempfile.new(['statement', '.pdf'])
    end
  end
end
