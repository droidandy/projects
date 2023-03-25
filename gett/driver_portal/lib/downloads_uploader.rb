class DownloadsUploader < BaseUploader
  def store_dir
    "#{dir_prefix}downloads"
  end
end
