require 'rails_helper'

RSpec.describe Addresses::Index, type: :service do
  subject(:service) { described_class.new(string: address_line, countries_filter: ['gb']) }

  describe '#execute!' do
    let(:predefined_stub)   { double }
    let(:address_list_stub) { double }
    let(:expected_result)   { {list: [:predefined, :address], status: 'ok'} }

    before do
      expect(Addresses::PredefinedList).to receive(:new).and_return(predefined_stub)
      expect(predefined_stub).to receive_message_chain(:execute, :result)
        .and_return([:predefined])

      expect(address_list_stub).to receive_message_chain(:execute, :result)
        .and_return(list: [:address], status: 'ok')
    end

    context 'when postal code is used' do
      let(:address_line) { ' N16 5UF' }

      it 'uses Pcaw::List service to find addresses' do
        expect(Pcaw::List).to receive(:new)
          .with(string: address_line).and_return(address_list_stub)

        expect(service.execute.result).to eq(expected_result)
      end
    end

    context 'when address line used' do
      let(:address_line) { '36 Allerton Road, London, N16 5UF' }

      it 'uses GoogleApi::AddressesList service to find addresses' do
        expect(GoogleApi::AddressesList).to receive(:new)
          .with(string: address_line, countries_filter: ['gb'])
          .and_return(address_list_stub)

        expect(service.execute.result).to eq(expected_result)
      end
    end
  end
end
