class BrowserMobHelper
  include Singleton

  CONNECT_RETRIES = 2

  def server
    return @server if @server

    port = 8180
    @server = BrowserMob::Proxy::Server.new(File.dirname(__FILE__) + '/../../bin/browsermob-proxy', port: port, log: false)
    unless @server.send(:listening?)
      @was_started = true
      @server.start
    end
    @server
  end

  def selenium_proxy_address
    proxy.selenium_proxy.http
  end

  def proxy
    retries = CONNECT_RETRIES
    begin
      @proxy ||= server.create_proxy
    rescue StandardError => e
      retries -= 1
      if retries > 0
        sleep 1
        retry
      end
      raise e
    end
    @proxy
  end

  def set_header(header, value)
    @headers ||= []
    @headers << header.to_s unless value.nil? || @headers.include?(header)
    hash = { header.to_s => value.to_s }
    proxy.header(hash)
  end

  def clear_header(header)
    set_header header, nil
  end

  def clear_all_headers
    @headers ||= []

    return if @headers.empty?

    @headers.each { |h| clear_header h }
    @headers = []
  end

  delegate :close, to: :proxy

  def stop
    @server.stop if @was_started
  end
end
