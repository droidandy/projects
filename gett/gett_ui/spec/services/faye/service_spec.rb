require 'rails_helper'

RSpec.describe Faye::Service, type: :service do
  describe '#execute' do
    let(:channel) { 'foo' }
    let(:data)    { {hello: 'world'} }
    let(:service) { Faye::Service.new(channel: channel, data: data, success: true) }

    before do
      allow(Settings.faye).to receive(:uri).and_return('http://localhost:8000/faye')
    end

    it 'performs HTTP POST request to Faye server' do
      request = double(:request)

      expect(Net::HTTP).to receive(:new).with('localhost', 8000).and_call_original
      expect(Net::HTTP::Post).to receive(:new)
        .with('/faye', 'Content-Type' => 'application/json').and_return(request)
      expect(request).to receive(:body=)
        .with({channel: "/foo", data: {data: data, success: true}}.to_json)
      expect_any_instance_of(Net::HTTP).to receive(:request).with(request)

      service.execute
    end
  end
end
