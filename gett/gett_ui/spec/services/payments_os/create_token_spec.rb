require 'rails_helper'

RSpec.describe PaymentsOS::CreateToken, type: :service do
  let(:service) { described_class.new(card_params: card_params) }
  let(:card_params) do
    {
      card_number:      '1111222233334444',
      cvv:              '111',
      holder_name:      'MOKER',
      expiration_month: 1,
      expiration_year:  2017
    }
  end

  describe '#execute' do
    let(:response_body) { {token: 'token'}.to_json }
    let(:response) { double(body: response_body, code: 201) }

    before do
      expect(RestClient).to receive(:post)
        .with('https://api.paymentsos.com/tokens', {
          'type'            => 'credit_card',
          'card_number'     => '1111222233334444',
          'expiration_date' => '01/2017',
          'holder_name'     => 'MOKER',
          'cvv'             => '111'
        }.to_json, anything)
        .and_return(response)
    end

    subject { service.execute }

    it { is_expected.to be_success }
    its(:result) { is_expected.to eq 'token' }
  end
end
