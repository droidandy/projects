require 'rails_helper'
require 'nexmo_client'

RSpec.describe NexmoClient do
  subject do
    described_class.new('44123456789', 'msg')
  end

  it 'send sms' do
    stub_request(
      :post, 'https://rest.nexmo.com/sms/json'
    ).to_return(
      status: 200, body: "", headers: {}
    )
    expect(subject.send_sms).to eq(true)
  end
end
