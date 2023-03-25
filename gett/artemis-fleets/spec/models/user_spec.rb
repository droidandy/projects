describe User do
  describe 'password validations' do
    it 'requires a minimum of 8 characters' do
      user = build(:member, password: 'Secure_')
      expect(user).to be_invalid
      expect(user.errors).to have_key(:password)
    end

    it 'requires at least one upcase character' do
      user = build(:member, password: 'secure_password')
      expect(user).to be_invalid
      expect(user.errors).to have_key(:password)
    end

    it 'requires at least one symbol' do
      user = build(:member, password: 'SecurePassword')
      expect(user).to be_invalid
      expect(user.errors).to have_key(:password)
    end

    it 'accepts a secure password' do
      user = build(:member, password: 'Secure_Password')
      expect(user).to be_valid
    end
  end
end
