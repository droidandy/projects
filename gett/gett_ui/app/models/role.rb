class Role < Sequel::Model
  USER_ROLES = %w(superadmin admin sales customer_care outsourced_customer_care).freeze
  MEMBER_ROLES = %w(companyadmin admin booker passenger finance travelmanager).freeze
  ENTERPRISE_ROLES = %w(admin finance travelmanager booker passenger).freeze
  AFFILIATE_ROLES = %w(admin booker).freeze
  ROLES = USER_ROLES | MEMBER_ROLES

  plugin :application_model
  plugin :config

  one_to_many :members, key: :member_role_id
  one_to_many :users, key: :user_role_id

  config do |c|
    c.use_cache = Rails.env !~ /^test/
  end

  def self.[](value)
    case value
    when String, Symbol
      if config.use_cache?
        roles_cache[value.to_s] ||= find(name: value.to_s)
      else
        find(name: value.to_s)
      end
    else
      super
    end
  end

  def self.roles_cache
    @roles_cache ||= {}
  end

  def validate
    super
    validates_presence :name
    validates_includes ROLES, :name
  end

  def allowed_for_affiliate?
    name == 'companyadmin' || name.in?(AFFILIATE_ROLES)
  end
end

# Table: roles
# Columns:
#  id         | integer                     | PRIMARY KEY DEFAULT nextval('roles_id_seq'::regclass)
#  name       | text                        | NOT NULL DEFAULT 'booker'::text
#  created_at | timestamp without time zone | NOT NULL
#  updated_at | timestamp without time zone | NOT NULL
# Indexes:
#  roles_pkey | PRIMARY KEY btree (id)
# Referenced By:
#  members | members_member_role_id_fkey | (member_role_id) REFERENCES roles(id)
#  users   | users_user_role_id_fkey     | (user_role_id) REFERENCES roles(id)
