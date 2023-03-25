class AvatarUploader < ImageUploader
  process :store_filename

  def store_filename
    model.avatar_filename = file.filename
  end
end
