class ImageUploader < ApplicationUploader
  def extension_white_list
    %w(jpg jpeg png gif svg)
  end
end
