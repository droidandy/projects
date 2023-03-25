require 'rails_helper'

RSpec.describe ShortUrl, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :original_url }
    it { is_expected.to validate_presence :token }
  end

  describe '.generate' do
    it 'creates new short url' do
      expect{ ShortUrl.generate('some_url') }.to change(ShortUrl, :count).by(1)
    end

    it 'generates uniquely tokenized url' do
      expect(SecureRandom).to receive(:hex).and_return('token')
      expect(ShortUrl.generate('some_url')).to include '/s/token'
    end

    context 'when short url already created' do
      before { create :short_url, original_url: 'http://localhost:3000/some_original', token: 'some_key' }

      it 'returns url matching existing token' do
        expect(ShortUrl.generate('some_original')).to include '/s/some_key'
      end

      it 'generates new key if key already present' do
        allow(SecureRandom).to receive(:hex).and_return('some_key', 'other_key')
        expect(ShortUrl.generate('other_original')).to include '/s/other_key'
      end
    end
  end
end
