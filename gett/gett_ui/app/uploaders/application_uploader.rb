class ApplicationUploader < CarrierWave::Uploader::Base
  def store_dir
    model_class = model.has_attribute?(:type) ? model.type : model.class.to_s
    # initially, only `Member` had avatars. but in scope of OU-584 avatar attribute
    # has been moved to `:users` table. thus, in order not to lose existing information
    # need to explicitly point them back to `members` until all data is moved to
    # proper location.
    model_class = 'Member' if model_class == 'User'
    "#{base_folder}/#{model_class.underscore}/#{mounted_as}/#{model.id}"
  end

  private def base_folder
    case Rails.env
    when 'dev', 'staging', 'production' then "gb_#{Rails.env}/uploads"
    when 'development' then 'uploads'
    when 'test', 'test_features' then 'test'
    end
  end
end
