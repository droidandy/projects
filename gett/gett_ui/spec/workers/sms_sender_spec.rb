require 'rails_helper'

RSpec.describe SmsSender, type: :worker do
  let(:worker) { described_class.new }

  it 'call Nexmo::SMS service' do
    expect(Nexmo::SMS).to receive(:new)
      .with(phone: 'phone', message: 'message').and_return(double(execute: true))

    worker.perform('phone', 'message')
  end
end
