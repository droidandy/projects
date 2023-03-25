require 'rails_helper'

RSpec.describe DriversApi::Drivers::Create do
  describe '#execute!' do
    let(:body) { { id: 111 }.to_json }
    let(:current_user) { create :user }

    let(:user) { create :user }

    let(:params) do
      {
        user: user
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:create_driver)
        .with(
          attributes: {
            display_name: user.name,
            driver_type: 'apollo',
            name: user.name,
            phone: user.phone
          }
        )
        .and_return(GenericApiResponse.new(200, body))
      subject.execute!
    end

    context 'when user updated' do
      before { stub_client(GettDriversApi::Client, :create_driver, body) }

      it 'returns created driver ID' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.driver_id).to eq(111)
      end
    end

    context 'when user update failed' do
      before { stub_client(GettDriversApi::Client, :create_driver, { error: 'ERROR' }.to_json, 400) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'ERROR' })
      end
    end
  end
end
