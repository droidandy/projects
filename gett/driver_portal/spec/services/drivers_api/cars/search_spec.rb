require 'rails_helper'

RSpec.describe DriversApi::Cars::Search do
  describe '#execute!' do
    let(:body) { json_body('gett/drivers_api/cars') }
    let(:current_user) { create :user }

    let(:license) { 'license' }

    let(:params) do
      {
        license: license
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:search_car)
        .with(license: license)
        .and_return(GenericApiResponse.new(200, body))
      subject.execute!
    end

    context 'when car found' do
      before { stub_client(GettDriversApi::Client, :search_car, body) }

      it 'returns car ID' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.car_id).to eq(59)
      end
    end

    context 'when no car found' do
      before { stub_client(GettDriversApi::Client, :search_car, [].to_json) }

      it 'returns car ID' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.car_id).to be_nil
      end
    end

    context 'when car search failed' do
      before { stub_client(GettDriversApi::Client, :search_car, { error: 'ERROR' }.to_json, 400) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'ERROR' })
      end
    end
  end
end
