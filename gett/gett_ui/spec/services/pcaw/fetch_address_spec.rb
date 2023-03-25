require 'rails_helper'

RSpec.describe Pcaw::FetchAddress, type: :service do
  let(:location_id) { '987986' }
  subject(:service) { described_class.new(location_id: location_id) }

  describe '#params' do
    subject(:params) { service.send(:params) }

    its([:Id]) { is_expected.to eq location_id }
  end
end
