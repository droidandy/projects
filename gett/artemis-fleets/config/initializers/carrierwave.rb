CarrierWave.configure do |config|
  if Rails.env.staging?
    config.fog_provider = 'fog/aws'
    config.fog_credentials = {
      aws_access_key_id:     Rails.application.secrets.s3_id,
      aws_secret_access_key: Rails.application.secrets.s3_secret,
      provider:              'AWS',
      region:                'eu-west-2'
    }
    config.fog_directory = Rails.application.secrets.s3_bucket
    config.storage :fog
  end

  if Rails.env.development? || Rails.env.test?
    config.storage :file
    config.asset_host = 'http://localhost:3000'
  end
end
