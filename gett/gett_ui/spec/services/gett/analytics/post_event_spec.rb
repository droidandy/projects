require 'rails_helper'

RSpec.describe Gett::Analytics::PostEvent, type: :service do
  describe '#params' do
    let(:event_name) { 'hello_world' }
    let(:event) { { name: event_name, properties: { company_name: 'name' } } }

    subject(:service) { described_class.new(event: event) }

    context 'development environemnt' do
      before { allow(Rails.env).to receive(:development?).and_return(true) }

      specify{ expect(service.execute).to be_success }
    end

    context 'dev environemnt' do
      before { allow(Rails.env).to receive(:dev?).and_return(true) }

      it 'calculates params correctly' do
        expect(service.send(:params)).to match(
          token: 'test_mp_fo_api_key',
          event_name: 'qa_ot_hello_world',
          event: 'qa_ot_hello_world',
          company_name: 'name'
        )
      end

      context 'event name starts with backoffice' do
        let(:event_name) { 'backoffice|hello_world' }

        it 'calculates params correctly' do
          expect(service.send(:params)).to match(
            token: 'test_mp_bo_api_key',
            event_name: 'qa_ot_backoffice|hello_world',
            event: 'qa_ot_backoffice|hello_world',
            company_name: 'name'
          )
        end
      end
    end

    context 'staging environemnt' do
      before do
        allow(Rails.env).to receive(:staging?).and_return(true)
      end

      it 'calculates params correctly' do
        expect(service.send(:params)).to match(
          token: 'test_mp_fo_api_key',
          event_name: 'qa_ot_hello_world',
          event: 'qa_ot_hello_world',
          company_name: 'name'
        )
      end

      context 'event name starts with backoffice' do
        let(:event_name) { 'backoffice|hello_world' }

        it 'calculates params correctly' do
          expect(service.send(:params)).to match(
            token: 'test_mp_bo_api_key',
            event_name: 'qa_ot_backoffice|hello_world',
            event: 'qa_ot_backoffice|hello_world',
            company_name: 'name'
          )
        end
      end
    end

    context 'not development environemnt' do
      before { allow(Rails.env).to receive(:production?).and_return(true) }

      it 'calculates params correctly' do
        expect(service.send(:params)).to match(
          token: 'test_mp_fo_api_key',
          event_name: 'ot_hello_world',
          event: 'ot_hello_world',
          company_name: 'name'
        )
      end

      context 'event name starts with backoffice' do
        let(:event_name) { 'backoffice|hello_world' }

        it 'calculates params correctly' do
          expect(service.send(:params)).to match(
            token: 'test_mp_bo_api_key',
            event_name: 'ot_backoffice|hello_world',
            event: 'ot_backoffice|hello_world',
            company_name: 'name'
          )
        end
      end
    end
  end
end
