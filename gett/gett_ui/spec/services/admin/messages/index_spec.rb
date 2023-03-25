require 'rails_helper'

RSpec.describe Admin::Messages::Index, type: :service do
  let!(:messages) { [create(:message)] }

  subject(:service) { described_class.new }

  describe '#execute' do
    before { service.execute }

    describe 'execution' do
      it { is_expected.to be_success }
    end

    describe 'results' do
      subject(:result) { service.result }

      context 'with only internal messages' do
        it { is_expected.to eq [] }
      end

      context 'with no messages' do
        let(:messages) { nil }

        it { is_expected.to eq [] }
      end

      context 'with external messages' do
        let!(:messages) { [create(:message, :external)] }

        it 'returns correct items' do
          expect(result.pluck('id')).to eq messages.pluck(:id)
        end

        context 'with more than LIMIT messages' do
          let!(:messages) do
            stub_const('Admin::Messages::Index::LIMIT', 2)
            create_list(:message, 3, :external)
          end

          it 'only returns LIMIT items' do
            expect(result.length).to eq 2
          end
        end
      end
    end
  end
end
