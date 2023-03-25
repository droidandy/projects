RSpec.describe Message do
  let(:company) { build(:company) }
  let(:user) { build(:member) }

  describe 'validations' do

    it 'check body parameter' do
      message = build(:message, body: '')
      expect(message).to be_invalid
      expect(message.errors).to have_key(:body)
    end

    it 'check sender parameter if company defined' do
      message = build(:message, body: '123', sender: nil, company: company)
      expect(message).to be_invalid
      expect(message.errors).to have_key(:sender)
    end

    it 'does not check sender without company' do
      message = build(:message, body: '123', sender: user)
      expect(message).to be_valid
    end

    it 'valid if all fields specified' do
      message = build(:message, body: '123', sender: user, company: company)
      expect(message).to be_valid
    end
  end

  describe '#internal?' do
    it 'true if has associated company' do
      message = build(:message, body: '123', company: company)
      expect(message.internal?).to be_truthy
    end

    it 'false if has no associated company' do
      message = build(:message, body: '123', company: nil)
      expect(message.internal?).to be_falsey
    end
  end
end
