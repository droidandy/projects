module Passengers
  class AutomaticImport < Passengers::Import
    attributes :company, :csv_file_path

    def execute!
      with_context(member: company.admin) { super }
      notify_of_errors
    end

    private def notify_of_errors
      return if @line_errors.blank? && !@encoding_error_present

      ImportMailer.error_report(company.id, @line_errors, @encoding_error_present).deliver_later
    end

    private def handle_line_error(line:, errors:, **)
      @line_errors ||= []
      @line_errors << { line: line, errors: errors } if errors.present?
    end

    private def handle_encoding_error
      @encoding_error_present = true
    end

    private def params
      {}
    end
  end
end
