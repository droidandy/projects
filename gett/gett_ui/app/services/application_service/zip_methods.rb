require 'zip'

module ApplicationService::ZipMethods
  def zip_folder(source_dir, archive_path)
    ::Zip::File.open(archive_path, ::Zip::File::CREATE) do |zipfile|
      Dir.entries(source_dir).without('.', '..').each do |filename|
        zipfile.add(filename, File.join(source_dir, filename))
      end
    end
  end
end
