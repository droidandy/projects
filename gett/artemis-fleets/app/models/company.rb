class Company < ApplicationRecord
  validates :name, presence: true
  validates :active, inclusion: {in: [true, false]}
  validates :fleet_id, presence: true

  has_many :members, dependent: :destroy
  belongs_to :salesman, optional: true
  belongs_to :address, optional: true
  belongs_to :legal_address, optional: true, class_name: 'Address'
  belongs_to :primary_contact, optional: true, class_name: 'Contact'
  belongs_to :billing_contact, optional: true, class_name: 'Contact'

  mount_base64_uploader :logo, ImageUploader

  def admin
    members.first
  end
end
