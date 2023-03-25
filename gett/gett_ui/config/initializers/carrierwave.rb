CarrierWave.configure do |config|
  if Rails.env.dev? || Rails.env.staging? || Rails.env.production?
    config.fog_provider = 'fog/aws'
    config.fog_credentials = {
      aws_access_key_id:     Settings.s3.id,
      aws_secret_access_key: Settings.s3.secret,
      provider:              'AWS',
      region:                'eu-west-2'
    }
    config.fog_directory = Settings.s3.bucket
    config.storage :fog
  end

  if Rails.env.development? || Rails.env.test? || Rails.env.test_features?
    config.storage :file
    config.asset_host = 'http://localhost:3000'
    config.enable_processing false
  end
end
