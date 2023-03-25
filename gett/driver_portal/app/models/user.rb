# == Schema Information
#
# Table name: users
#
#  id                         :bigint(8)        not null, primary key
#  email                      :string           not null
#  first_name                 :string
#  last_name                  :string
#  password_digest            :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  gett_id                    :integer
#  phone                      :string
#  address                    :string
#  city                       :string
#  postcode                   :string
#  account_number             :string
#  sort_code                  :string
#  badge_number               :string
#  vehicle_colour             :string
#  vehicle_type               :string
#  vehicle_reg                :string
#  reset_password_digest      :string
#  blocked_at                 :datetime
#  avatar                     :string
#  badge_type                 :string
#  license_number             :string
#  is_frozen                  :boolean          default(FALSE), not null
#  hobbies                    :string
#  talking_topics             :string
#  driving_cab_since          :date
#  disability_type            :string
#  disability_description     :string
#  birth_date                 :date
#  approval_status            :integer          default("documents_missing"), not null
#  approver_id                :bigint(8)
#  ready_for_approval_since   :datetime
#  how_did_you_hear_about     :string
#  onboarding_step            :integer          default(0), not null
#  onboarding_failed_at       :datetime
#  other_rating               :decimal(3, 2)
#  vehicle_reg_year           :integer
#  insurance_number           :string
#  insurance_number_agreement :boolean          default(FALSE), not null
#  documents_agreement        :boolean          default(FALSE), not null
#  appointment_scheduled      :boolean          default(FALSE), not null
#  documents_uploaded         :boolean          default(FALSE), not null
#  gett_phone                 :string
#  avatar_filename            :string
#  min_rides_number           :integer
#

class User < ApplicationRecord
  ONBOARDING_STEPS = (0..6).to_a.freeze
  include PgSearch

  FILTER_COLUMNS = {
    'all' => %i[
      badge_number
      email
      first_name
      gett_id
      gett_phone
      last_name
      license_number
      phone
      vehicle_reg
    ],
    'assignment' => %i[first_name last_name phone gett_phone license_number],
    'badge_number' => :badge_number,
    'email' => :email,
    'gett_id' => :gett_id,
    'license_number' => :license_number,
    'name' => %i[first_name last_name],
    'phone' => %i[phone gett_phone],
    'vehicle_reg' => :vehicle_reg
  }.freeze

  pg_search_scope(:filter, lambda do |query, category|
    {
      query: query,
      against: FILTER_COLUMNS.fetch(category),
      using: { tsearch: { prefix: true } }
    }
  end)

  rolify

  has_secure_password

  has_paper_trail only: %i[email first_name last_name phone city]

  validates :email, presence: true, uniqueness: true
  validates :gett_id, uniqueness: true, allow_nil: true
  validates :approver_id, uniqueness: true, allow_nil: true
  validates :onboarding_step, inclusion: { in: ONBOARDING_STEPS }

  before_validation :normalize_email, if: :email_changed?

  has_many :permissions, through: :roles

  has_many :invites, dependent: :destroy
  has_one :last_invite, -> { order(created_at: :desc) }, class_name: 'Invite'
  has_many :sent_invites, class_name: 'Invite', foreign_key: 'sender_id', dependent: :destroy

  has_many :metrics, dependent: :destroy, class_name: 'UserMetric'
  has_one :last_metric, -> { order(created_at: :desc) }, class_name: 'UserMetric'

  has_many :logins, dependent: :destroy

  has_many :stats, dependent: :destroy, class_name: 'UserStat'
  has_one :last_stat, -> { order(created_at: :desc) }, class_name: 'UserStat'

  has_many :documents, dependent: :destroy

  has_many :vehicles, dependent: :destroy

  belongs_to :approver, class_name: 'User', required: false
  has_one :driver_to_approve, class_name: 'User', foreign_key: :approver_id, dependent: :nullify

  has_many :reviews, inverse_of: :driver, foreign_key: :driver_id, dependent: :destroy
  has_one :review, -> { order(created_at: :desc) }, class_name: 'Review', foreign_key: :driver_id

  has_many :assigned_reviews,
    class_name: 'Review',
    inverse_of: :agent,
    foreign_key: :agent_id,
    dependent: :nullify

  has_many :agent_statuses, dependent: :destroy
  has_one :agent_status, -> { current }

  enum approval_status: %i[documents_missing pending rejected approved], _suffix: true

  mount_uploader :avatar, AvatarUploader

  def admin?
    has_any_role?(*Role::ADMINS)
  end

  def driver?
    has_any_role?(*Role::DRIVERS)
  end

  def onboarding_agent?
    has_any_role?(*Role::ONBOARDING_AGENTS)
  end

  def active?
    !blocked_at
  end

  def in_queue?
    ready_for_approval_since.present?
  end

  def name
    [first_name, last_name].compact.join(' ')
  end

  def name=(value)
    self.first_name = value.to_s.split(' ').first
    self.last_name = value.to_s.split(' ').last
  end

  def onboarding_completed?
    onboarding_step == ONBOARDING_STEPS.last
  end

  private def normalize_email
    self.email = self.class.normalized_email(email)
  end

  def self.normalized_email(email)
    email&.strip&.downcase
  end
end
