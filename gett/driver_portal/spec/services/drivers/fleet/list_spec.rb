require 'rails_helper'

RSpec.describe Drivers::Fleet::List do
  describe '#execute!' do
    let(:body) { json_body('gett/fleet_api/drivers') }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        driver_ids: [1, 2, 3],
        fields: %i[statistics license_no],
        page: 2,
        per: 7
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with only ids' do
      let(:params) do
        {
          driver_ids: [1, 2, 3]
        }
      end

      it 'works' do
        stub_client(GettFleetApi::Client, :drivers, body)
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'with valid params' do
      it 'runs successfully' do
        stub_client(GettFleetApi::Client, :drivers, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(GettFleetApi::Client).to receive(:drivers).
          with(
            driver_ids: [1, 2, 3],
            fields: %i[id statistics license_no],
            page: 2,
            per: 7
          )
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'returns valid amount of data' do
        stub_client(GettFleetApi::Client, :drivers, body)
        subject.execute!
        expect(subject.drivers.count).to eq(2)
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(GettFleetApi::Client, :drivers, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'returns nothing' do
        subject.execute!
        expect(subject.drivers).to be_nil
      end

      it 'has errors' do
        subject.execute!
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
