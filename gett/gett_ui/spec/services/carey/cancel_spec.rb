require 'rails_helper'
require 'spec_helper'

RSpec.describe Carey::Cancel, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking) { create(:booking, service_id: 'WA10701683-1') }
  let(:response) do
    double(body: {
      ota_ground_cancel_rs: {
        a: 1
      }
    })
  end

  let(:savon_client) { double(operations: [:cancel_reservation]) }
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
      Reservation: {
        UniqueID: {
          :@ID => booking.service_id
        }
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
          'X-SOAP-Method': 'cancelReservation'
        }
      )
      .and_return(savon_client)
    allow(service).to receive(:last_version).and_return("1")
    allow(service).to receive(:sequence_number).and_return('12345')
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:cancel_reservation, message: message, attributes: { Version: "1", SequenceNmbr: '12345' })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end
end
