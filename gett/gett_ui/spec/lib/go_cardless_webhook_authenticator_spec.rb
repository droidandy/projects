require 'rails_helper'

RSpec.describe GoCardlessWebhookAuthenticator do
  let(:request) do
    double(
      raw_post: 'raw_post',
      headers: {
        'Webhook-Signature' => signature
      }
    )
  end

  subject { GoCardlessWebhookAuthenticator.new(request) }

  context 'valid signature' do
    let(:signature) { 'f6921a313b4624de1fa0f1f310c105498a338b05410cef06158c6bb5a510090f' }

    its(:authenticate) { is_expected.to eq(true) }
  end

  context 'invalid signature' do
    let(:signature) { 'invalid' }

    its(:authenticate) { is_expected.to eq(false) }
  end
end
