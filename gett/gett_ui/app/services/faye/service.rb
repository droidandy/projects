class Faye::Service < ApplicationService
  attributes :channel, :data, :success

  def execute!
    http = Net::HTTP.new(uri.hostname, uri.port)
    req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
    req.body = {channel: "/#{channel}", data: {data: data, success: success}}.to_json
    http.request(req)
  end

  private def uri
    @uri ||= URI(Settings.faye.uri)
  end
end
