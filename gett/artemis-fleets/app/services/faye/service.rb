require 'net/http'

class Faye::Service < InternalService
  delegate :port, :path, to: :'Settings.faye'

  def execute!
    http = ::Net::HTTP.new('localhost', port)
    req = ::Net::HTTP::Post.new(path, 'Content-Type' => 'application/json')
    req.body = {channel: "/#{params.channel}", data: {data: params.data, success: params.success}}.to_json
    http.request(req)
  end
end
