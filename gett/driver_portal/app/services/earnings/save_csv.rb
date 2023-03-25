require 'downloads_uploader'

module Earnings
  class SaveCSV < ApplicationService
    attr_reader :csv_url

    schema do
      required(:driver).filled
      required(:from).filled(:date_time?)
      required(:to).filled(:date_time?)
      optional(:external_ids).maybe(:array?)
    end

    def execute!
      compose(GenerateCSV.new(current_user, @args), :csv)
      return unless @csv

      File.open(tempfile, 'wb') { |f| f.write @csv }
      tempfile.rewind

      uploader.store!(tempfile)
      @csv_url = uploader.full_url

      success!
    ensure
      tempfile.close
      tempfile.unlink
    end

    private def tempfile
      @tempfile ||= Tempfile.new(['earnings', '.csv'])
    end

    private def uploader
      @uploader ||= DownloadsUploader.new
    end
  end
end
