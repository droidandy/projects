class BaseUploader < CarrierWave::Uploader::Base
  def store_dir
    slashed_id = format('%09d', model.id).gsub(/(\d.+)(\d{3})(\d{3})$/, '\1/\2/\3')
    "#{dir_prefix}#{model.class.to_s.underscore}/#{mounted_as}/#{slashed_id}"
  end

  def full_url
    if Rails.env.production?
      url
    elsif url
      [Rails.application.config.asset_host, url].join
    end
  end

  def full_path
    Rails.env.production? ? file.try(:authenticated_url) : file.try(:path)
  end

  private def dir_prefix
    case Rails.env
    when 'production'
      ''
    when 'development'
      'system/uploads/'
    when 'test'
      'system/spec_uploads/'
    else
      ''
    end
  end
end
