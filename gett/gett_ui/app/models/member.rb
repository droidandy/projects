using Sequel::CoreRefinements

class Member < User
  module PhoneType
    MOBILE = 'mobile'.freeze
    PHONE = 'phone'.freeze
    ALL = [MOBILE, PHONE].freeze
  end

  plugin :association_pks
  plugin :dirty
  plugin :boolean_readers
  plugin :audited,
    values: [
      :phone, :mobile, :payroll, :cost_centre, :onboarding,
      :division, :active, :notify_with_sms, :notify_with_email,
      :notify_with_push, avatar: :filename
    ],
    many_to_one: [
      :department,
      :work_role,
      member_role: { relation: :role }
    ],
    many_to_many: [
      { passengers: { name: :full_name, class: User } },
      { bookers: { name: :full_name, class: User } }
    ]
  plugin :boolean_readers

  many_to_one :company
  many_to_one :role, key: :member_role_id
  many_to_one :work_role
  many_to_one :department

  many_to_many :travel_rules, join_table: :travel_rules_users,
    right_key: :travel_rule_id, left_key: :user_id

  one_to_many :comments, class: 'MemberComment'

  # have to mount uploader here as well for it to play nicely for both User and Member
  mount_base64_uploader :avatar, AvatarUploader, file_name: proc { "avatar-#{Time.current.to_i}" }

  # TODO: segregate Bookers from Passengers so that bookers won't have other
  # bookers, and passengers won't have other passengers
  include Member::Booker
  include Member::Passenger
  include Member::BBC

  dataset_module do
    scope(:active) { where(:users[:active]) }

    scope(:with_active_company) do
      select_all(:users)
        .join(:companies, id: :company_id)
        .where(:companies[:active])
    end
  end

  add_association_dependencies(
    travel_rules: :nullify
  )

  delegate :companyadmin?, :admin?, :passenger?, :finance?, :travelmanager?, to: :role_name, allow_nil: true

  # used to skip some SQL-related validations on import
  attr_accessor :import

  private def before_update
    reset_column(:onboarding) if column_changed?(:onboarding) && initial_value(:onboarding) == false
    super
  end

  private def after_update
    super

    return unless column_changed?(:first_name) || column_changed?(:last_name)

    DB[:booking_indexes].where(passenger_id: id).update(passenger_full_name: full_name.downcase)
  end

  def validate
    super
    validates_presence [:company, :role]
    validates_phone_number :phone
    validate_affiliate_role
    validates_includes(PhoneType::ALL, :default_phone_type, allow_nil: true)
  end

  def realm
    company.enterprise? ? 'app' : 'affiliate'
  end

  def realms
    super + [realm]
  end

  def active?
    active && company.active?
  end

  def role_name
    role&.name&.inquiry
  end

  def role_type
    return :admin if admin? || companyadmin?

    role_name&.to_sym
  end

  def executive?
    companyadmin? || admin? || travelmanager?
  end

  def booker?
    exactly_booker? || finance?
  end

  def exactly_booker?
    role_name.booker?
  end

  # used in Booker and Passenger modules validation
  private def roles_by_member_pks(pks)
    Role.association_join(:members).where(Sequel[:members][:id] => pks).distinct.select_map(:name)
  end

  private def validate_affiliate_role
    return unless company&.affiliate?
    return if role.nil? || role.allowed_for_affiliate?

    errors.add(:role, 'not allowed for affiliate companies')
  end
end
