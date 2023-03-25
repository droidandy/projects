require 's3_tmp_file'
using Sequel::CoreRefinements

module Bookings
  class Receipts::ExportBunch < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::Background
    include ApplicationService::ZipMethods

    USER_RECEIPTS_DIRNAME = 'exported_receipts'.freeze
    USER_RECEIPTS_PATHNAME = Rails.root.join("tmp/#{USER_RECEIPTS_DIRNAME}").freeze
    private_constant :USER_RECEIPTS_DIRNAME, :USER_RECEIPTS_PATHNAME

    attributes :periods, :passenger_id
    background_attributes :periods, :passenger, :member

    def self.policy_class
      Bookings::IndexPolicy
    end

    def execute!
      if total_bookings > 0
        send_to_background(execution_args)
      else
        notify(
          channel,
          { error: I18n.t('services.bookings.receipts.no_receipts_found') },
          { success: false }
        )
      end
    end

    def background_execute!
      cleanup_old_files!
      success!

      Dir.mktmpdir do |tmp_dir|
        create_pdfs(tmp_dir)
        create_zip(tmp_dir)
        zip_to_s3
        notify_progress(current: total_bookings, download_path: download_path)
      end
    end

    def passenger
      @passenger ||= attributes[:passenger] || fetch_passenger
    end

    def member
      attributes[:member] || context.member
    end

    private def fetch_passenger
      passenger_id.present? ? Passengers::IndexPolicy.scope[member].with_pk!(passenger_id.to_i) : member
    end

    private def download_path
      Rails.application.routes.url_helpers.download_bunch_receipts_path(filename: zip_basename)
    end

    private def execution_args
      { periods: periods, passenger: passenger, member: member }
    end

    private def bookings_dataset
      passenger.bookings_dataset.credit.billed
    end

    private def bookings
      return @bookings if defined?(@bookings)

      expressions = months.map { |month| :bookings[:scheduled_at] =~ (month..month.end_of_month) }

      @bookings = bookings_dataset
        .where(expressions.reduce(&:|))
        .distinct(:bookings[:id])
        .select(:bookings.*)
        .all
    end

    private def months
      @months ||= periods.map(&:to_datetime)
    end

    private def channel
      "export-receipts-bunch-#{member.id}"
    end

    private def total_bookings
      bookings.length
    end

    private def create_pdfs(tmp_dir)
      bookings.each_with_index do |booking, current|
        save_path = File.join(tmp_dir, "#{booking.id}.pdf")
        File.open(save_path, 'wb') do |file|
          file << Documents::Receipt.new(booking_id: booking.id, format: :pdf).execute.result
          notify_progress(current: current)
        end
      end
    rescue StandardError => error
      notify(channel, { error: error.message }, { success: false })
      Airbrake.notify(error)
    end

    private def notify_progress(current:, **rest)
      progress = (total_bookings > 0) ? (current * 100 / total_bookings) : 0
      notify(
        channel,
        rest.merge(
          title: I18n.t('services.bookings.receipts.exporting'),
          progress: progress,
          total: total_bookings
        )
      )
    end

    private def zip_basename
      "receipts.#{month_range}.zip"
    end

    private def month_range
      months.sort.map { |m| m.strftime('%Y.%m') }.uniq.join('_')
    end

    private def create_zip(source_dir)
      dir = self.class.target_dir_for(member)
      zip_filename = dir.join('receipts.zip')
      FileUtils.mkdir_p(dir)

      zip_folder(source_dir, zip_filename)
    end

    private def zip_to_s3
      s3_zipfile_name = self.class.s3_zipfile_name(member)
      zip_path = self.class.zipfile_path(member)
      S3TmpFile.write(s3_zipfile_name, File.read(zip_path))
    end

    private def cleanup_old_files!
      dir = self.class.target_dir_for(member)
      FileUtils.rm_r(dir) if dir.exist?
      S3TmpFile.delete_dir(self.class.s3_target_dir_for(member))
    end

    def self.target_dir_for(member)
      USER_RECEIPTS_PATHNAME.join(member.id.to_s)
    end

    def self.zipfile_path(member)
      target_dir_for(member).join('receipts.zip').to_s
    end

    def self.s3_target_dir_for(member)
      "#{USER_RECEIPTS_DIRNAME}/#{member.id}"
    end

    def self.s3_zipfile_name(member)
      "#{s3_target_dir_for(member)}/receipts.zip"
    end

    def self.s3_zipfile_content(member)
      S3TmpFile.read(s3_zipfile_name(member))
    end
  end
end
