require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

CarrierWave.configure do |config|
  if Rails.env.production?
    config.storage :fog
    config.fog_provider = 'fog/aws'
    config.fog_credentials = Rails.application.secrets.fog_credentials
    config.fog_directory  = Rails.application.secrets.fog_directory
    config.fog_public = false
  else
    config.storage :file
    config.enable_processing = false if Rails.env.test?
  end
end
