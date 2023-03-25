using Sequel::CoreRefinements

class User < Sequel::Model
  extend Carrierwave::Base64::Adapter

  plugin :application_model
  plugin :class_table_inheritance, key: :kind, alias: :users
  plugin :secure_password
  plugin :string_stripper
  plugin :association_dependencies
  plugin :boolean_readers
  plugin :audited,
    values: [:email, :first_name, :last_name, :locked, :locks_count],
    many_to_one: [:role]

  many_to_one :user_role, class: :Role
  one_to_many :messages, key: :sender_id
  one_to_many :received_messages, class: :Message, key: :recipient_id
  one_to_one :api_key
  one_to_many :direct_debit_mandates, key: :created_by_id
  one_to_many :user_devices

  add_association_dependencies(
    messages: :delete,
    api_key: :delete,
    direct_debit_mandates: :destroy
  )

  mount_base64_uploader :avatar, AvatarUploader, file_name: proc { "avatar-#{Time.current.to_i}" }

  dataset_module do
    def by_name
      order(:users[:first_name], :users[:last_name])
    end

    def active
      select_append(:users[:id].as(:id))
        .left_join(:members, id: :id)
        .left_join(:companies, id: :company_id)
        .where{ (:users[:kind] =~ 'User') | ((:members[:active] =~ true) & (:companies[:active] =~ true)) }
    end

    def with_user_role(name)
      where(:users[:user_role_id] => Role[name].id)
    end
  end

  def validate
    email&.downcase!
    generate_password if new?
    super
    validates_presence [:first_name, :last_name, :email]
    validates_email :email
    validates_unique :email, message: I18n.t('validation_errors.email_taken'), dataset: User.dataset
    validates_name [:first_name, :last_name]
  end

  def valid_password?(password)
    authenticate(password).present?
  end

  def active?
    true
  end

  def realm
    'admin'
  end

  def realms
    user_role_id.present? ? ['admin'] : []
  end

  def set_reset_password_token!
    self.reset_password_token = SecureRandom.hex(10)
    self.reset_password_sent_at = Time.current
    save
  end

  def user_role_name
    user_role&.name&.inquiry
  end

  def member?
    is_a?(Member)
  end

  def superadmin?
    user_role_name&.superadmin?
  end

  def back_office?
    user_role_id.present?
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  # used in email layout and view checks: company-less users are also considered as
  # enterprise and use corresponding partials.
  def enterprise?
    !member? || company&.enterprise?
  end

  def affiliate?
    member? && company&.affiliate?
  end

  def avatar_versions
    avatar.versions.transform_values(&:url)
  end

  private def generate_password
    return if password.present?

    generated_password = SecureRandom.hex(32)
    self.password = generated_password
    self.password_confirmation = generated_password
  end
end

# Table: users
# Columns:
#  id                      | integer                     | PRIMARY KEY DEFAULT nextval('users_id_seq'::regclass)
#  email                   | text                        | NOT NULL
#  password_digest         | text                        |
#  kind                    | user_type                   |
#  created_at              | timestamp without time zone | NOT NULL
#  updated_at              | timestamp without time zone | NOT NULL
#  reset_password_token    | text                        |
#  reset_password_sent_at  | timestamp without time zone |
#  last_logged_in_at       | timestamp without time zone |
#  notification_seen_at    | timestamp without time zone |
#  first_name              | text                        | NOT NULL
#  last_name               | text                        | NOT NULL
#  avatar                  | text                        |
#  user_role_id            | integer                     |
#  login_count             | integer                     | DEFAULT 0
#  invalid_passwords_count | integer                     | NOT NULL DEFAULT 0
#  locks_count             | integer                     | NOT NULL DEFAULT 0
#  locked                  | boolean                     | NOT NULL DEFAULT false
# Indexes:
#  users_pkey            | PRIMARY KEY btree (id)
#  users_email_key       | UNIQUE btree (email)
#  users_full_name_index | gin (concat_space(first_name, last_name) gin_trgm_ops)
# Foreign key constraints:
#  users_user_role_id_fkey | (user_role_id) REFERENCES roles(id)
# Referenced By:
#  bookers_passengers    | bookers_passengers_booker_id_fkey        | (booker_id) REFERENCES users(id)
#  bookers_passengers    | bookers_passengers_passenger_id_fkey     | (passenger_id) REFERENCES users(id)
#  bookings              | bookings_booker_id_fkey                  | (booker_id) REFERENCES users(id)
#  bookings              | bookings_cancelled_by_id_fkey            | (cancelled_by_id) REFERENCES users(id)
#  bookings              | bookings_passenger_id_fkey               | (passenger_id) REFERENCES users(id)
#  company_infos         | company_infos_account_manager_id_fkey    | (account_manager_id) REFERENCES users(id)
#  company_infos         | company_infos_salesman_id_fkey           | (salesman_id) REFERENCES users(id)
#  members               | members_id_fkey                          | (id) REFERENCES users(id)
#  messages              | messages_recipient_id_fkey               | (recipient_id) REFERENCES users(id)
#  messages              | messages_sender_id_fkey                  | (sender_id) REFERENCES users(id)
#  passenger_addresses   | passenger_addresses_passenger_id_fkey    | (passenger_id) REFERENCES users(id)
#  payment_cards         | payment_cards_passenger_id_fkey          | (passenger_id) REFERENCES users(id)
#  travel_rules_users    | travel_rules_users_user_id_fkey          | (user_id) REFERENCES users(id)
#  feedbacks             | feedbacks_user_id_fkey                   | (user_id) REFERENCES users(id)
#  booking_messages      | booking_messages_user_id_fkey            | (user_id) REFERENCES users(id)
#  invoices              | invoices_created_by_id_fkey              | (created_by_id) REFERENCES users(id)
#  invoices              | invoices_member_id_fkey                  | (member_id) REFERENCES users(id)
#  invoices              | invoices_paid_by_id_fkey                 | (paid_by_id) REFERENCES users(id)
#  api_keys              | api_keys_user_id_fkey                    | (user_id) REFERENCES users(id)
#  comments              | comments_author_id_fkey                  | (author_id) REFERENCES users(id)
#  comments              | comments_member_id_fkey                  | (member_id) REFERENCES users(id)
#  direct_debit_mandates | direct_debit_mandates_created_by_id_fkey | (created_by_id) REFERENCES users(id)
#  user_devices          | user_devices_user_id_fkey                | (user_id) REFERENCES users(id)
