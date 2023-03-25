require 'rails_helper'

RSpec.describe ApplicationService::ModelMethods, type: :service do
  let(:model) { double('Sequel::Model') }

  describe '#save_model' do
    let(:service_klass) do
      Class.new(ApplicationService) do
        include ApplicationService::ModelMethods

        attributes :model, :params

        def execute!
          save_model(model, params, { bar: 'bar' }, { validate: false })
        end
      end
    end

    let(:service) { service_klass.new(model: model, params: {foo: 'foo'}) }

    it 'sets params and saves with proper save options' do
      expect(model).to receive(:set).with(foo: 'foo', bar: 'bar').ordered
      expect(model).to receive(:save).with(validate: false).ordered.and_return(model)
      expect(service.execute.result).to be model
    end
  end

  describe '#assign_address' do
    let(:service_klass) do
      Class.new(ApplicationService) do
        include ApplicationService::ModelMethods

        attributes :model, :params, :key

        def execute!
          assign_address(model, params)
        end
      end
    end

    let(:model)   { create(:company_info) }
    let(:service) { service_klass.new(model: model, params: params) }
    let(:address) { create(:address) }
    let(:airport) { create(:airport) }
    let(:params) do
      {
        id: address.id,
        line: address.line,
        lat: address.lat,
        lng: address.lng,
        postal_code: address.postal_code,
        country_code: address.country_code,
        city: address.city,
        region: address.region,
        airport_iata: airport.iata,
        street_name: address.street_name
      }
    end

    context 'when assigning address with "Home" address line' do
      let(:params) { super().merge(line: 'Home') }

      it 'fails with exception' do
        expect{ service.execute }.to raise_error(ArgumentError, "attempt to assign 'Home' as address line")
      end
    end

    it 'assign address to model' do
      expect(service.execute.result.address_id).to eq(address.id)
    end

    context 'airport assignment' do
      context 'when address exists' do
        it 'address should not update an airport' do
          expect(service.execute.result.address.airport_id).to be_nil
        end
      end

      context 'when address does not exists' do
        context 'when airport_iata is present' do
          let(:params) do
            {
              line: '9162 Zulauf Knoll',
              lat: 70.9233537476467,
              lng: 75.5929237760641,
              country_code: 'TM',
              city: 'Lake Suzanneshire',
              airport_iata: airport.iata,
              street_name: 'Zulauf Knoll'
            }
          end

          it 'address should have an airport id' do
            expect(service.execute.result.address.airport_id).to be(airport.id)
          end
        end

        context 'when airport_iata is not present' do
          let(:params) do
            {
              line: '9162 Zulauf Knoll',
              lat: 70.9233537476467,
              lng: 75.5929237760641,
              country_code: 'TM',
              city: 'Lake Suzanneshire',
              street_name: 'Zulauf Knoll'
            }
          end

          it 'address aiport id should be nil' do
            expect(service.execute.result.address.airport_id).to be_nil
          end
        end
      end
    end
  end
end
