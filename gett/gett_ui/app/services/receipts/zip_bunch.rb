require 'zip'

using Sequel::CoreRefinements

class Receipts::ZipBunch < ApplicationService
  include ApplicationService::ZipMethods

  attributes :passenger, :bookings

  def self.user_receipts_path
    Rails.root.join('tmp/user_receipts')
  end

  def self.cleanup_old_receipts!
    FileUtils.rm_r(user_receipts_path) if user_receipts_path.exist?
  end

  delegate :user_receipts_path, to: :class

  def execute!
    return if bookings.blank?

    result { create_all }
  end

  private def create_all
    Dir.mktmpdir do |tmp_dir|
      create_pdfs(tmp_dir)
      create_zip(tmp_dir)
    end
  end

  private def create_pdfs(tmp_dir)
    bookings.each do |booking|
      save_path = File.join(tmp_dir, "#{booking.id}.pdf")
      File.open(save_path, 'wb') do |file|
        file << Documents::Receipt.new(booking_id: booking.id, format: :pdf).execute.result
      end
    end
  end

  # Archive receipts into '{rails_dir}/tmp/user_receipts/{passenger_id}/{passenger_name}.zip'
  private def create_zip(tmp_dir)
    target_dir = create_target_dir
    target_zip = "#{target_dir}#{zip_filename}"

    zip_folder(tmp_dir, target_zip)
    target_zip
  end

  private def zip_filename
    "#{passenger.full_name.gsub(%r{^.*(\\|/)}, '').gsub(/[^0-9A-Za-z.\-]/, '_')}.zip"
  end

  private def receipt_dir
    "#{passenger.id}_#{SecureRandom.hex}/"
  end

  private def create_target_dir
    tmp_dir_path = user_receipts_path.join(receipt_dir)
    FileUtils.mkdir_p(tmp_dir_path)
    tmp_dir_path
  end
end
