require 'rails_helper'

RSpec.describe Mobile::V1::Addresses::QuickSearch, type: :service do
  let(:service) { described_class.new(lat: 1, lng: 2, criterion: criterion) }

  describe '#execute' do
    let(:results) { 'results' }
    let(:service_result) { double(execute: double(result: results, success?: true)) }

    before do
      allow(Mobile::V1::Addresses::Recent).to receive(:new).and_return(service_result)
      allow(GoogleApi::NearbySearch).to receive(:new).and_return(service_result)
    end

    context 'with wrong criterion' do
      before { expect(GoogleApi::NearbySearch).not_to receive(:new) }

      let(:criterion) { 'food' }

      it { expect(service.execute).not_to be_success }
    end

    context 'with next_page_token criterion' do
      let(:service) { described_class.new(next_page_token: 'token') }

      before do
        expect(GoogleApi::NearbySearch).to receive(:new).with(pagetoken: 'token')
      end

      it { expect(service.execute).to be_success }
    end

    context 'with correct criterion' do
      context 'with special criterion' do
        let(:service) { described_class.new(criterion: 'recent') }

        before { expect(Mobile::V1::Addresses::Recent).to receive(:new) }

        it 'success' do
          expect(service.execute).to be_success
          expect(service.execute.result).to eq('results')
        end
      end

      context 'with regular criterion' do
        before do
          expect(GoogleApi::NearbySearch).to receive(:new).with(
            { location: '1,2', type: criterion }.merge(other_params)
          )
        end

        context 'airport' do
          let(:criterion) { 'airport' }
          let(:other_params) do
            { rankby: 'distance', name: 'airport' }
          end
          let(:results) { {list: ['google airport']} }

          before do
            create(:predefined_address, :with_airport, line: 'Airport', lat: 1, lng: 2)
          end

          it 'has proper results, including closest POI airports' do
            expect(service.execute).to be_success
            expect(service.execute.result).to eq(list: ['google airport', text: 'Airport', lat: 1, lng: 2, types: ['airport']])
          end
        end

        context 'train_station' do
          let(:criterion) { 'train_station' }
          let(:other_params) do
            { radius: 6000 }
          end

          it 'success' do
            expect(service.execute).to be_success
            expect(service.execute.result).to eq('results')
          end
        end

        %w(lodging restaurant point_of_interest).each do |criterion_str|
          context criterion_str do
            let(:criterion) { criterion_str }
            let(:other_params) do
              { radius: 4830 }
            end

            it 'success' do
              expect(service.execute).to be_success
              expect(service.execute.result).to eq('results')
            end
          end
        end
      end
    end
  end
end
