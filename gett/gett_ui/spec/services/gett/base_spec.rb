require 'rails_helper'

RSpec.describe Gett::Base, type: :service do
  subject(:service) { service_class.new }

  describe '#business_id' do
    subject { service.send(:business_id) }

    let(:service_class) { described_class }
    let(:company)       { create(:company, gett_business_id: 'UK-1234') }
    service_context { { company: company } }

    before { expect(service).to receive(:business_id_country_code).and_return(country_code) }

    context 'when country code is IL' do
      let(:country_code) { 'IL' }

      before { allow(Settings.gt).to receive(:il_business_id).and_return('IL-4321') }

      it { is_expected.to eq('IL-4321') }
    end

    context 'when country code is RU' do
      let(:country_code) { 'RU' }

      before { allow(Settings.gt).to receive(:ru_business_id).and_return('RU-4321') }

      it { is_expected.to eq('RU-4321') }
    end

    context 'when country code is not IL or RU' do
      let(:country_code) { 'UK' }

      it { is_expected.to eq('UK-1234') }
    end
  end

  describe '#business_id_country_code' do
    subject(:business_id_country_code) { service.send(:business_id_country_code) }

    context 'when service has :booking_attribute' do
      let(:booking) { create(:booking, pickup_address: create(:address, :baker_street)) }
      let(:service) { service_class.new(booking: booking) }
      let(:service_class) { Class.new(described_class) { attributes :booking } }

      it 'uses booking pickup address to fetch business_id country code' do
        expect(business_id_country_code).to eq('GB')
      end
    end

    context 'when custom block is used' do
      let(:service)       { service_class.new }
      let(:service_class) { Class.new(described_class) { fetch_business_id_from { 'IL' } } }

      it 'uses .fetch_business_id_from class method block to fetch business_id country code' do
        expect(business_id_country_code).to eq('IL')
      end
    end
  end

  describe 'GET service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :get

        def url
          super('/foo')
        end

        def params
          { a: 1 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }
      let(:error_response) { double(body: {error: :some_error}, code: 400) }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))
      end

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:get)
            .with('http://localhost/foo', params: { a: 1 }, content_type: 'application/json')
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end

      context 'when raises rest client exception' do
        let(:error) { RestClient::BadRequest.new }
        before do
          allow(error).to receive(:response).and_return(error_response)
          expect(RestClient).to receive(:get).and_raise(error)
          allow(service).to receive(:request_error_message)
            .with(error, :get, instance_of(Array))
            .and_return('request error message')
        end

        it 'logs error' do
          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error)
            .with('request error message')
            .and_call_original
          service.execute
        end

        it 'does not succeed' do
          service.execute
          is_expected.not_to be_success
        end
      end
    end
  end

  describe 'POST service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :post

        def url
          super('/bar')
        end

        def params
          { b: 2 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))
      end

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:post)
            .with('http://localhost/bar', { b: 2 }.to_json, content_type: 'application/json')
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end
    end
  end

  describe 'PATCH service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :patch

        def url
          super('/bar')
        end

        def params
          { b: 2 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))
      end

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:patch)
            .with('http://localhost/bar', { b: 2 }.to_json, content_type: 'application/json')
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end
    end
  end
end
