require 'rails_helper'

RSpec.describe Incomings::Carey::StatusUpdateHandler, type: :service do
  let(:payload) do
    {
      "res_num" => reservation_id,
      "status" => "En Route",
      "status_update_datetime" => "2017-04-20T01 => 06 => 50",
      "pickup_time" => "2017-04-20T02 => 59 => 00",
      "acn_time" => "2017-04-19T22 => 59 => 00",
      "is_status_rollback" => false,
      "is_stopped" => "NA",
      "geocode_status" => {
        "latitude" => 28.4113217,
        "longitude" => 77.5154068
      },
      "token" => token,
      "chauffeur" => {
        "first_name" => "Chf First",
        "last_name" => "Chf Last",
        "chauffeur_contact_details" => [
          { "contactType" => "CELL", "contactValue" => "3333333333"}
        ],
        "imageUrl" => "https => //www1.carey.com/Carey/images/drvr_images/xxx.jpg"
      },
      "vehicle" => {
        "type" => "Executive Sedan",
        "make" => "Lincoln",
        "model" => "MKS",
        "license_num" => "XYZ123",
        "pax_capacity" => 3,
        "luggage_capacity" => 4
      },
      "publish_datetime" => "2017-04-20T01:06:51"
    }.with_indifferent_access
  end
  let(:reservation_id) { "WA11111111-1" }
  let(:token) { "1031" }

  subject(:service) { described_class.new(payload: payload) }

  describe '#execute!' do
    before do
      allow(Airbrake).to receive(:notify)
      allow(Bookings::DriverUpdater).to receive(:new).and_return(double(execute: double(success?: true, result: true)))
      allow(Faye.bookings).to receive(:notify_update)
    end

    context 'when booking was not found' do
      it 'fails and notifies Airbrake' do
        expect{ service.execute }.not_to change(Incoming, :count)
        expect(service).not_to be_success
        expect(Airbrake).to have_received(:notify).with(an_instance_of(Incomings::Carey::WebhookFailedError))
      end
    end

    context 'when booking was found' do
      let!(:booking) { create(:booking, :carey, service_id: reservation_id) }

      before do
        expect(Bookings::DriverUpdater).to receive(:new)
          .with(booking: booking, params: {
            name: "Chf First Chf Last",
            image_url: "https => //www1.carey.com/Carey/images/drvr_images/xxx.jpg",
            phone_number: "3333333333",
            vehicle: { model: "Lincoln MKS", license_plate: "XYZ123" },
            lat: 28.4113217,
            lng: 77.5154068
          })
      end

      it 'executes successfully and creates Incoming record' do
        expect{ service.execute }.to change(Incoming, :count).by(1)
        expect(service).to be_success
      end

      it 'updates booking' do
        service.execute
        expect(booking.reload).to have_attributes(
          status: 'on_the_way',
          carey_token: token
        )
      end
    end

    context 'when status was changed' do
      let!(:booking) { create(:booking, :carey, service_id: reservation_id) }

      it 'receives if status was changed' do
        service.execute
        expect(Faye.bookings).to have_received(:notify_update)
      end

      before { Timecop.freeze(Time.current.change(nsec: 0)) }
      after  { Timecop.return }

      it 'sets allocated_at' do
        expect{ service.execute }.to change{ booking.reload.allocated_at }.from(nil).to(Time.current)
      end
    end

    context 'when status was not recognized' do
      let!(:booking) { create(:booking, :carey, service_id: reservation_id) }

      before { stub_const('Incomings::Carey::StatusUpdateHandler::STATUS_MAPPING', {}) }

      it 'executes unsuccessfully and notifies Airbrake' do
        expect(service.execute).not_to be_success
        expect(Airbrake).to have_received(:notify).with(an_instance_of(Incomings::Carey::WebhookFailedError))
      end
    end
  end

  describe '#incoming' do
    let!(:booking) { create(:booking, :carey, service_id: reservation_id) }

    subject(:incoming) { service.send(:incoming) }

    it 'should build Incoming instance' do
      expect(incoming).to be_an_instance_of(Incoming)
      expect(incoming).to have_attributes(service_type: 'carey', payload: payload)
    end
  end
end
