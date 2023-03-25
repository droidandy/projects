require 'rails_helper'

RSpec.describe DriversApi::Documents::Create do
  subject { described_class.new(current_user, params) }

  let(:current_user) { create(:user) }
  let(:document) do
    create :document,
           user: user,
           expires_at: expires_at,
           started_at: started_at,
           vehicle: vehicle,
           unique_id: 'QWER1234'
  end

  let(:params) do
    {
      document: document
    }
  end

  let(:user) { create :user, gett_id: 999 }
  let(:expires_at) { Time.current + 1.month }
  let(:started_at) { Time.current - 1.month }
  let(:attributes) do
    {
      expiration_time: expires_at.iso8601,
      start_time: started_at,
      document_type: document.kind.slug,
      document_id: 'QWER1234'
    }
  end

  context 'when a driver document' do
    let(:vehicle) { nil }

    it 'invoke client' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:create_document)
        .with(
          driver_id: 999,
          car_id: nil,
          attributes: attributes
        )
        .and_return(GenericApiResponse.new(200, { id: 1 }.to_json))
      subject.execute!
    end
  end

  context 'when a vehicle document' do
    let(:vehicle) { create :vehicle, gett_id: 666 }

    it 'invoke client' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:create_document)
        .with(
          driver_id: 999,
          car_id: 666,
          attributes: attributes
        )
        .and_return(GenericApiResponse.new(200, { id: 1 }.to_json))
      subject.execute!
    end
  end
end
