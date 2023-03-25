module Passengers
  class ManualImport < Passengers::Import
    include ApplicationService::Policy

    attributes :params

    delegate :member, :company, to: :context

    private def handle_line_error(line:, status:, errors:)
      Faye.notify(channel,
        line: line,
        total: total_lines,
        status: status,
        errors: errors
      )
    end

    private def handle_encoding_error
      Faye.notify(channel, processing_error: I18n.t('passengers.import.errors.invalid_encoding'))
    end

    private def channel
      "import-#{member.id}"
    end

    private def csv_file_path
      params[:file].tempfile.path
    end
  end
end
