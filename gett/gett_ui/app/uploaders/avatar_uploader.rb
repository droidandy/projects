class AvatarUploader < ImageUploader
  include CarrierWave::RMagick

  version :px420 do
    process resize_to_fit: [420, 420]
  end

  version :px150, from_version: :px420 do
    process resize_to_fit: [150, 150]
  end
end
