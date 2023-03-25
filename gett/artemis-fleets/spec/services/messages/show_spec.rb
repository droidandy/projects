RSpec.describe Messages::Show do
  let(:message) { create(:message, body: 'Some urgent message') }
  let(:service) { Messages::Show.new(message: message) }

  describe '#execute' do
    subject { service.execute.result.stringify_keys }

    let(:result_data) {{
      'id'         => message.id,
      'body'       => 'Some urgent message',
      'created_at' => message.created_at,
      'avatar'     => nil,
      'sender_id'  => message.sender_id,
      'title'      => message.sender.full_name
    }}

    it { is_expected.to eq result_data }
  end
end
