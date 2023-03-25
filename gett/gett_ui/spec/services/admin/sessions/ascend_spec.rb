require 'rails_helper'

RSpec.describe Admin::Sessions::Ascend, type: :service do
  let(:admin) { create :user, :admin }

  subject(:service) { Admin::Sessions::Ascend.new }

  describe '#execute' do
    service_context { { admin: admin } }

    it 'returns token without incarnation flag' do
      expect(JsonWebToken).to receive(:encode).with(id: admin.id).and_return('token')
      expect(service.execute.result).to eq(token: 'token', realm: 'admin')
    end
  end
end
