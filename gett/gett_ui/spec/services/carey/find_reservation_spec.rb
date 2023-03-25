require 'rails_helper'
require 'spec_helper'

RSpec.describe Carey::FindReservation, type: :service do
  subject(:service) { described_class.new(reservation_id: reservation_id) }

  let(:reservation_id) { 'WA10701683-1' }
  let(:response) { double(body: { ota_ground_res_retrieve_rs: { :@version => "1" } }) }

  let(:savon_client) { double(operations: [:find_reservation]) }
  let(:message) do
    {
      POS: {
        Source: {
          RequestorID: {
            :@MessagePassword => "TestPassword",
            :@ID => "test@test.test",
            :@Type => "TA"
          },
          BookingChannel: {
            content!: {
              CompanyName: {
                content!: "TestCompanyFullName",
                :@Code => "AppKey",
                :@CompanyShortName => "TestCompany",
                :@CodeContext => "TestContext"
              }
            },
            :@Type => "TA"
          }
        }
      },
      Reference: {
        :@ID => reservation_id
      }
    }
  end

  before do
    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'findReservation'
        }
      )
      .and_return(savon_client)
    allow(savon_client).to receive(:call).and_return(response)
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:find_reservation, message: message)
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    let(:company) { create(:company) }
    let(:expected_response) do
      { version: '1' }
    end

    before { service.execute }
    its(:normalized_response) { is_expected.to eq expected_response }
  end
end
