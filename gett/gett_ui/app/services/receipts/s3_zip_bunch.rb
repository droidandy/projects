require 's3_tmp_file'

class Receipts::S3ZipBunch < Receipts::ZipBunch
  def self.user_receipts_s3_path
    'user_receipts'
  end

  delegate :user_receipts_s3_path, to: :class

  def self.cleanup_old_receipts!
    S3TmpFile.delete_dir(user_receipts_s3_path)
    super
  end

  def execute!
    return if bookings.blank?

    zip_path = create_all
    return if zip_path.blank?

    result { S3TmpFile.write(zip_full_name, File.read(zip_path)) }
  end

  private def zip_full_name
    "#{user_receipts_s3_path}/#{receipt_dir}#{zip_filename}"
  end
end
