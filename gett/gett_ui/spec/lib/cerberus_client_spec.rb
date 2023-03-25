require 'rails_helper'

RSpec.describe CerberusClient do
  before { allow(RestClient).to receive(:post) }

  let(:client) { CerberusClient.new }

  specify '#create_directory' do
    expect{ client.create_directory('foo') }.not_to raise_error
    expect(RestClient).to have_received(:post)
      .with(kind_of(String), kind_of(String), hash_including(content_type: :xml, timeout: 5))
  end

  specify '#create_user' do
    expect{ client.create_user('foo', 'bar', 'baz') }.not_to raise_error
    expect(RestClient).to have_received(:post)
      .with(kind_of(String), kind_of(String), hash_including(content_type: :xml, timeout: 5))
  end
end
