class Message < ApplicationRecord
  belongs_to :company, optional: true
  belongs_to :sender, class_name: 'User', optional: true

  scope :external, -> { where('company_id IS NULL') }

  validates_presence_of :body
  validates_presence_of :sender, if: :internal?

  def internal?
    company.present?
  end
end
