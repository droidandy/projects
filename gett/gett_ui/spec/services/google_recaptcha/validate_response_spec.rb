require 'rails_helper'

RSpec.describe GoogleRecaptcha::ValidateResponse, type: :service do
  subject(:service) { described_class.new(captcha_response: 'Captcha') }

  describe '#execute' do
    before do
      expect(RestClient).to receive(:post)
        .with(
          "https://www.google.com/recaptcha/api/siteverify?secret=secret_key&response=Captcha",
          { content_type: 'application/x-www-form-urlencoded; charset=utf-8' }.to_json,
          {}
        )
        .and_return(validation_response)
      service.execute
    end

    context 'successfull response' do
      let(:validation_response) { double(body: { 'success' => true }.to_json, code: 200) }

      it { is_expected.to be_success }
    end

    context 'unsuccessfull response' do
      let(:validation_response) { double(body: { 'success' => false }.to_json, code: 200) }

      it { is_expected.not_to be_success }
    end
  end
end
