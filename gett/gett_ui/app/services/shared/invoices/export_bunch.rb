require 's3_tmp_file'

module Shared::Invoices
  class ExportBunch < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::Background
    include ApplicationService::ZipMethods

    TITLE = "Exporting invoices...".freeze
    USER_INVOICES_DIRNAME = 'exported_invoices'.freeze
    USER_INVOICES_PATHNAME = Rails.root.join("tmp/#{USER_INVOICES_DIRNAME}").freeze
    private_constant :TITLE, :USER_INVOICES_DIRNAME, :USER_INVOICES_PATHNAME

    def execute!
      send_to_background(execute_args)
    end

    def background_execute!
      cleanup_old_files!
      success!

      Dir.mktmpdir do |tmp_dir|
        create_pdfs(tmp_dir)
        create_zip(tmp_dir)
        zip_to_s3
        notify_progress(current: total_invoices, download_path: download_path)
      end
    end

    private def invoices
      return @invoices if defined?(@invoices)

      expressions =
        months.map do |month|
          Sequel[:invoices][:created_at] =~ (month..month.end_of_month)
        end

      @invoices = invoices_dataset.where(expressions.reduce(&:|)).eager(company: :admin).all
    end

    private def months
      @months ||= periods.map(&:to_datetime)
    end

    private def channel
      "export-invoices-bunch-#{user.id}"
    end

    private def total_invoices
      invoices.length
    end

    private def create_pdfs(tmp_dir)
      invoices.each_with_index do |invoice, current|
        save_path = File.join(tmp_dir, "#{invoice.id}.pdf")

        File.open(save_path, 'wb') do |file|
          file <<
            if invoice.credit_note?
              ::Documents::CreditNote.new(credit_note: invoice, format: :pdf).execute.result
            else
              ::Documents::Invoice.new(invoice: invoice, format: :pdf).execute.result
            end
          # by the end of processing final message would be total: N, current: N-1.
          # this is done intentionally: the latest message with current matching total will
          # be sent after final archive file is formed.
          notify_progress(current: current)
        end
      end
    rescue StandardError => error
      notify(channel, { error: error.message }, { success: false })
      Airbrake.notify(error)
    end

    private def notify_progress(current:, **rest)
      progress = current * 100 / total_invoices
      notify(channel, rest.merge(title: TITLE, progress: progress, total: total_invoices))
    end

    private def zip_basename
      'invoices.' + months.minmax.map{ |m| m.strftime('%Y.%m') }.uniq.join('-') + '.zip'
    end

    private def create_zip(source_dir)
      dir = self.class.target_dir_for(user)
      zip_filename = dir.join('invoices.zip')
      FileUtils.mkdir_p(dir)

      zip_folder(source_dir, zip_filename)
    end

    private def zip_to_s3
      s3_zipfile_name = self.class.s3_zipfile_name(user)
      zip_path = self.class.zipfile_path(user)
      S3TmpFile.write(s3_zipfile_name, File.read(zip_path))
    end

    private def cleanup_old_files!
      dir = self.class.target_dir_for(user)
      FileUtils.rm_r(dir) if dir.exist?
      S3TmpFile.delete_dir(self.class.s3_target_dir_for(user))
    end

    def self.target_dir_for(user)
      USER_INVOICES_PATHNAME.join(user.id.to_s)
    end

    def self.zipfile_path(user)
      target_dir_for(user).join('invoices.zip').to_s
    end

    def self.s3_target_dir_for(user)
      "#{USER_INVOICES_DIRNAME}/#{user.id}"
    end

    def self.s3_zipfile_name(user)
      "#{s3_target_dir_for(user)}/invoices.zip"
    end

    def self.s3_zipfile_content(user)
      S3TmpFile.read(s3_zipfile_name(user))
    end
  end
end
