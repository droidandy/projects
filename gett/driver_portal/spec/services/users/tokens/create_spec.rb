require 'rails_helper'

RSpec.describe Users::Tokens::Create do
  describe '#execute!' do
    subject { described_class.new(params) }
    let(:user) { create :user }
    let(:token) { 'token' }

    let(:params) do
      {
        driver_id: user.id
      }
    end

    it 'writes data and return token' do
      expect(TokenManager).to receive(:new).and_return(instance_double(TokenManager, write: true, token: token))
      subject.execute!
      expect(subject).to be_success
      expect(subject.token).to eq(token)
    end

    context 'with invalid user ID' do
      let(:params) do
        {
          driver_id: 999
        }
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ user: 'not found' })
      end
    end
  end
end
