require 'rails_helper'

RSpec.describe Splyt::Base do
  let(:service_class) do
    Class.new(Splyt::Base) do
      http_method :get

      private def url
        super('/test_url')
      end
    end
  end

  subject(:service) { service_class.new }

  describe '#execute' do
    let(:result) { 123 }
    let(:response) { double(success?: true) }

    before do
      allow(service).to receive(:make_request!).and_return(result)
      allow(service).to receive(:response).and_return(response)
    end

    it 'calls make_request! and pass result to @result' do
      expect(service).to receive(:make_request!).and_return(result)

      service.execute

      expect(service.result).to eq(result)
    end

    context 'when response is not success' do
      let(:response) { double(success?: false) }

      it 'cleans @result' do
        expect(service).to receive(:response).and_return(response)

        service.execute

        expect(service.result).to be false
      end
    end
  end
end
