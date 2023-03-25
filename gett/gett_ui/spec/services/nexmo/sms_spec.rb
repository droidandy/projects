require 'rails_helper'

RSpec.describe Nexmo::SMS, type: :service do
  let(:booking) { create :booking }
  let(:phone)   { '+44712341234' }
  let(:message) { 'one & two = three' }

  subject(:service) do
    Nexmo::SMS.new(phone: phone, message: message)
  end

  describe '#execute' do
    let(:success_response) { {status: 200, body: "{}"} }
    let(:base_params) do
      {
        from: 'Gett',
        text: message,
        api_key: Settings.nexmo.api_key,
        type: 'text',
        timestamp: Time.now.getutc.to_i
      }
    end

    let(:params) do
      post_params = base_params.merge(to: '+44712341234')
      sig_params = post_params.merge(text: 'one _ two _ three')
      sig = '&' + CGI.unescape(URI.encode_www_form(sig_params.sort)) + Settings.nexmo.security_secret

      post_params.merge(sig: Digest::MD5.hexdigest(sig))
    end

    context 'when client gets valid response' do
      before do
        stub_request(:post, 'https://rest.nexmo.com/sms/json')
          .with(body: params.to_json)
          .to_return(success_response)
        service.execute
      end

      its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
      it { is_expected.to be_success }

      it 'creates a Request record' do
        request = Request.last
        expect(request.service_provider).to eq 'nexmo'
      end
    end

    context 'with multiple phone numbers' do
      let(:phone) { ['+44712341234', '+44700001111'] }

      it 'sends text to each phone number' do
        stub_request(:post, 'https://rest.nexmo.com/sms/json').to_return(success_response)

        service.execute

        expect(WebMock).to have_requested(:post, 'https://rest.nexmo.com/sms/json').twice
      end
    end
  end

  describe '#sanitize_phone' do
    it 'sanitizes phone number for UK properly' do
      # task OU-439: if phone starts with '07', remove '0' and add '44'
      expect(service.send(:sanitize_phone, '+44 7834 56789')).to eq '+44783456789'
      expect(service.send(:sanitize_phone, '+359(189)252-1')).to eq '+3591892521'
    end
  end
end
