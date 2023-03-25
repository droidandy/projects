require 'zip'
require 'downloads_uploader'

module Statements
  class CreateZIP < ApplicationService
    attr_reader :zip_data
    attr_reader :zip_url

    schema do
      required(:statements_ids).filled(:array?)
    end

    def execute!
      @pdfs_added = 0
      assemble_zip

      if @pdfs_added.zero?
        fail!(errors: { zip: 'is empty' })
        return
      end

      uploader.store!(zip_tempfile)
      @zip_url = uploader.full_url
      @zip_data = File.read(zip_tempfile.path)
      success!
    ensure
      zip_tempfile.close
      zip_tempfile.unlink
    end

    private def assemble_zip
      # Tempfile should be initialized as a ZIP file to be processed successfully.
      # Source: http://thinkingeek.com/2013/11/15/create-temporary-zip-file-send-response-rails/
      Zip::OutputStream.open(zip_tempfile) { |zos| }

      Zip::File.open(zip_tempfile.path, Zip::File::CREATE) do |zipfile|
        statements_ids.each do |statement_id|
          compose(
            Statements::PDF::Get.new(current_user, statement_id: statement_id),
            :pdf_data,
            pass_errors: false
          )
          if @pdf_data
            zipfile.get_output_stream(filename(statement_id)) { |f| f.write @pdf_data }
            @pdfs_added += 1
          end
        end
      end
    end

    private def filename(statement_id)
      "#{statement_id}.pdf"
    end

    private def zip_tempfile
      @zip_tempfile ||= Tempfile.new(['statements', '.zip'])
    end

    private def uploader
      @uploader ||= DownloadsUploader.new
    end
  end
end
