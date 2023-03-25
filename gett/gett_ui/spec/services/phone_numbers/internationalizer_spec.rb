require 'rails_helper'

RSpec.describe PhoneNumbers::Internationalizer, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(phone_number: phone_number) }

    context 'with valid phone number in first local format' do
      let(:phone_number) { "011234567" }

      it 'returns valid international number' do
        expect(service.execute.result).to eq "+4411234567"
      end
    end

    context 'with valid phone number in second local format' do
      let(:phone_number) { "201234567" }

      it 'returns valid international number' do
        expect(service.execute.result).to eq "+44201234567"
      end
    end

    context 'with valid phone number in third local format' do
      let(:phone_number) { "971234567" }

      it 'returns valid international number' do
        expect(service.execute.result).to eq "+971234567"
      end
    end

    context 'with valid phone number containing not only digits' do
      let(:phone_number) { "+7 (123) 4567" }

      it 'returns valid international number without redundant symbols' do
        expect(service.execute.result).to eq "+71234567"
      end
    end

    context 'with valid phone number in international format' do
      let(:phone_number) { "+71234567" }

      it 'returns value without changes' do
        expect(service.execute.result).to eq "+71234567"
      end
    end

    context 'with blank phone number' do
      let(:phone_number) { "" }

      it 'returns nothing' do
        expect(service.execute.result).to be_nil
      end
    end
  end
end
