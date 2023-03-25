require 'rails_helper'

RSpec.describe Bookings::ReferencesProcessor, type: :service do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }
  let!(:reference1) { create(:booking_reference, company: company, priority: 1) }
  let!(:reference2) { create(:booking_reference, :validation_required, company: company, priority: 2) }

  service_context { { company: company, user: admin } }

  describe '#execute' do
    let(:value)                        { '123' }
    let!(:validated_booking_reference) { create(:booking_reference, :validation_required, company: company, name: 'Ref 1') }
    let!(:reference_entry)             { create(:reference_entry, booking_reference: validated_booking_reference, value: value) }
    let!(:mandatory_booking_reference) { create(:booking_reference, :mandatory, company: company, name: 'Ref 2') }
    let!(:optional_booking_reference)  { create(:booking_reference, company: company, name: 'Ref 3') }

    context 'when only need to validate value' do
      subject(:service) { Bookings::ReferencesProcessor.new(params: params, validate_value: true) }

      before { service.execute }

      context 'when reference input is valid' do
        context 'when validated reference is submitted' do
          let(:params) do
            [
              { booking_reference_id: validated_booking_reference.id, value: value },
              { booking_reference_id: mandatory_booking_reference.id, value: 'any value' },
              { booking_reference_id: optional_booking_reference.id, value: nil }
            ]
          end

          it { is_expected.to be_success }

          it 'instantiates booker_references properly' do
            expect(service.booker_references.count).to eq 2
            expect(service.booker_references.first&.value).to eq value
            expect(service.booker_references.second&.value).to eq 'any value'
          end
        end

        context 'when validated reference is not submitted' do
          let(:params) do
            [
              { booking_reference_id: validated_booking_reference.id, value: nil },
              { booking_reference_id: mandatory_booking_reference.id, value: 'any value' },
              { booking_reference_id: optional_booking_reference.id, value: nil }
            ]
          end

          it { is_expected.to be_success }

          it 'creates booker_references properly' do
            expect(service.booker_references.count).to eq 1
            expect(service.booker_references.first&.value).to eq 'any value'
          end
        end
      end

      context 'when reference input is invalid' do
        context 'when mandatory reference not submitted' do
          let(:params) do
            [
              { booking_reference_id: validated_booking_reference.id, value: value },
              { booking_reference_id: mandatory_booking_reference.id, value: nil },
              { booking_reference_id: optional_booking_reference.id, value: nil }
            ]
          end

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.not_to be_blank }
        end

        context 'when validated reference has invalid value' do
          let(:params) do
            [
              { booking_reference_id: validated_booking_reference.id, value: 'wrong value' },
              { booking_reference_id: mandatory_booking_reference.id, value: 'any value' },
              { booking_reference_id: optional_booking_reference.id, value: nil }
            ]
          end

          it { is_expected.not_to be_success }
          its(:errors) { is_expected.not_to be_blank }
        end
      end
    end

    context 'when creating references' do
      let(:booking) { create(:booking, company: company) }

      subject(:service) { Bookings::ReferencesProcessor.new(params: params, booking_id: booking.id) }

      context 'with valid params' do
        let(:params) do
          [
            { booking_reference_id: validated_booking_reference.id, value: value },
            { booking_reference_id: mandatory_booking_reference.id, value: 'any value' },
            { booking_reference_id: optional_booking_reference.id, value: nil }
          ]
        end

        it 'creates booker_references' do
          expect{ service.execute }.to change(booking.booker_references_dataset, :count).by(2)
        end
      end
    end
  end
end
