class User < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
  validates :password, length: {minimum: 8}, if: :password
  validate :password_characters_validation, if: :password

  before_validation :generate_password, on: :create

  has_many :messages, foreign_key: :company_id

  REALM_MAPPING = {
    'Administrator' => 'admin',
    'Member' => 'app'
  }.freeze

  def realm
    REALM_MAPPING.fetch(type)
  end

  def reset_password_token!
    update!(
      reset_password_token: SecureRandom.hex(10),
      reset_password_sent_at: Time.current
    )
  end

  private def generate_password
    return if password.present?
    self.password = self.password_confirmation =
      SecureRandom.hex(32) + UPCASE.sample + SYMBOLS.sample
  end

  UPCASE = ('A'..'Z').to_a
  SYMBOLS = "~`!@$#%^&*()-_=+[{]}\|;:'\",<.>/?".chars

  private def password_characters_validation
    return if [UPCASE, SYMBOLS].all? do |group|
      group.any? { |char| char.in?(password) }
    end
    errors.add(:password, 'does not match the criteria')
  end
end
