class DocumentUploader < BaseUploader
  process :store_content_type

  def store_content_type
    model.content_type = file.content_type
    model.file_name = file.filename
  end
end
