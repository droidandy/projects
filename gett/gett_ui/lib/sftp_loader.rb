require 'net/sftp'

class SftpLoader
  def initialize(host:, port: 22, username:, password:)
    @host = host
    @port = port
    @username = username
    @password = password
  end

  def load(path)
    Dir.mktmpdir do |dir|
      local_path = File.join(dir, 'tempfile')

      Net::SFTP.start(
        @host,
        @username,
        port: @port,
        password: @password,
        compression: false
      ) do |sftp|
        return if sftp.dir.glob('', path).blank? # rubocop:disable Lint/NonLocalExitFromIterator

        sftp.download!(path, local_path)
      end

      yield(local_path)
    end
  end
end
