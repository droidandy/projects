require 'rails_helper'

RSpec.describe GenericApiResponse do
  let(:http_status) { 200 }
  let(:response_body) { { sample: :json }.to_json }
  subject { described_class.new(http_status, response_body) }

  describe '#body' do
    it 'parses response' do
      expect(subject.body).to eq({ 'sample' => 'json' })
    end

    context 'with not JSON response' do
      let(:response_body) { '<!DOCTYPE html><html><body>Unexpected HTML!</body></html>' }

      it 'returns error' do
        expect(subject.body).to eq({})
      end
    end
  end
end
