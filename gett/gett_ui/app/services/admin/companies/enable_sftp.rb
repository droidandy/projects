require 'cerberus_client'

module Admin::Companies
  class EnableSftp < ApplicationService
    include ApplicationService::ModelMethods
    attributes :company

    def execute!
      return success! if company.sftp_username.present?

      client = CerberusClient.new
      password = SecureRandom.hex
      client.create_directory(directory)
      client.create_user(username, password, directory)
      update_model(company, sftp_username: username, sftp_password: password)
    end

    private def username
      return @username if defined?(@username)

      env = Rails.env.production? ? nil : Rails.env
      @username = [env, 'company', company.id].compact.join('_')
    end

    alias directory username
  end
end
