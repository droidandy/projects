class ApplicationUploader < CarrierWave::Uploader::Base
  def store_dir
    model_class = model.has_attribute?(:type) ? model.type : model.class.to_s
    "#{base_folder}/#{model_class.underscore}/#{mounted_as}/#{model.id}"
  end

  private def base_folder
    case Rails.env
    when 'staging' then "artemis_fleets_staging/uploads"
    when 'development' then 'development_uploads'
    when 'test' then 'test_uploads'
    end
  end
end
