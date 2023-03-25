require 'sftp_loader'

module HrFeed
  class Fetch < ApplicationService
    attributes :company

    def execute!
      SftpLoader.new(
        host: Settings.cerberus.sftp_endpoint,
        port: Settings.cerberus.sftp_port,
        username: company.sftp_username,
        password: company.sftp_password
      ).load('hr_feed.csv') do |local_path|
        Passengers::AutomaticImport.new(company: company, csv_file_path: local_path).execute
      end
    end
  end
end
