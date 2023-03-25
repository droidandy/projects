require 'rails_helper'

RSpec.describe Admin::Members::Show, type: :service do
  it { is_expected.to be_authorized_by(Admin::Policy) }

  service_context { { admin: create(:user, :admin) } }
  subject(:service) { described_class.new(passenger: create(:passenger)) }

  describe '#execute' do
    it 'sets permissions' do
      expect(service.execute.result.dig('can', :be_expanded)).to eq(true)
    end
  end
end
