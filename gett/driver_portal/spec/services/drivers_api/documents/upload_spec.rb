require 'rails_helper'

RSpec.describe DriversApi::Documents::Upload do
  subject { described_class.new(current_user, params) }

  let(:current_user) { create(:user) }
  let(:params) do
    {
      document: document
    }
  end

  let(:user) { create :user, gett_id: 999 }

  context 'when a driver document' do
    let(:document) { create :document, user: user, gett_id: 888 }

    it 'invoke client' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:document_upload)
        .with(
          driver_id: 999,
          car_id: nil,
          document_id: 888,
          file: document.file,
          content_type: document.content_type
        )
        .and_return(GenericApiResponse.new(200, { id: 1 }.to_json))
      subject.execute!
    end
  end

  context 'when a vehicle document' do
    let(:vehicle) { create :vehicle, gett_id: 666 }
    let(:document) { create :document, user: user, vehicle: vehicle, gett_id: 888 }

    it 'invoke client' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:document_upload)
        .with(
          driver_id: 999,
          car_id: 666,
          document_id: 888,
          file: document.file,
          content_type: document.content_type
        )
        .and_return(GenericApiResponse.new(200, { id: 1 }.to_json))
      subject.execute!
    end
  end
end
