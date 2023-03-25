require 'rails_helper'

RSpec.describe Gett::Analytics::Authenticate, type: :service do
  subject(:service) { described_class.new }

  specify '#params' do
    expect(service.send(:params)).to match(
      grant_type:    :client_credentials,
      client_id:     'test_client_id',
      client_secret: 'test_client_secret',
      scope:         :relay
    )
  end
end
