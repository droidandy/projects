require 'rails_helper'

RSpec.describe Drivers::Fleet::One do
  describe '#execute!' do
    let(:body) { json_body('gett/fleet_api/driver') }
    let(:error_body) { json_body('gett/fleet_api/error') }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        driver_id: 1,
        fields: %i[statistics license_no]
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with only id' do
      let(:params) do
        {
          driver_id: 1
        }
      end

      it 'works' do
        stub_client(GettFleetApi::Client, :driver, body, response_class: GettFleetApi::Response)
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'with valid params' do
      it 'runs successfully' do
        stub_client(GettFleetApi::Client, :driver, body, response_class: GettFleetApi::Response)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(GettFleetApi::Client).to receive(:driver).
          with(
            driver_id: 1,
            fields: %i[id statistics license_no]
          )
          .and_return(GettFleetApi::Response.new(200, body))
        subject.execute!
      end

      it 'returns driver' do
        stub_client(GettFleetApi::Client, :driver, body, response_class: GettFleetApi::Response)
        subject.execute!
        expect(subject.driver).to be_present
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(GettFleetApi::Client, :driver, error_body, 200, response_class: GettFleetApi::Response)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'returns nothing' do
        subject.execute!
        expect(subject.driver).to be_nil
      end

      it 'has errors' do
        subject.execute!
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
