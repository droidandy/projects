# == Schema Information
#
# Table name: roles
#
#  id            :bigint(8)        not null, primary key
#  name          :string
#  resource_type :string
#  resource_id   :bigint(8)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Role < ApplicationRecord
  ALL = %w[
    community_manager
    compliance_agent
    driver
    apollo_driver
    driver_support
    site_admin
    system_admin
    onboarding_agent
  ].freeze

  DRIVERS = %w[driver apollo_driver].freeze

  ADMINS = %w[
    community_manager
    compliance_agent
    driver_support
    site_admin
    onboarding_agent
  ].freeze

  ONBOARDING_AGENTS = %w[
    onboarding_agent
  ].freeze

  has_and_belongs_to_many :users, join_table: :users_roles
  has_and_belongs_to_many :permissions, join_table: :roles_permissions

  belongs_to :resource, polymorphic: true, optional: true

  validates :resource_type, inclusion: { in: Rolify.resource_types }, allow_nil: true

  scopify
end
