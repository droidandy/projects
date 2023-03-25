using Sequel::CoreRefinements

module Admin::Users
  class Form < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :user

    delegate :admin, to: :context

    def execute!
      {
        user: user_data,
        user_roles: available_roles,
        member_roles: Role::MEMBER_ROLES.without('companyadmin'),
        companies: companies,
        can: {
          change_company: !user_companyadmin?,
          change_member_role: can_change_user_role? && !user_companyadmin?,
          change_user_role: can_change_user_role?
        }
      }
    end

    private def can_change_user_role?
      user.nil? || policy.change_user_role?
    end

    private def available_roles
      admin.user_role_name.admin? ? Role::USER_ROLES.without('superadmin') : Role::USER_ROLES
    end

    private def user_data
      user.present? ? existing_user_data : {user_role_name: :admin}
    end

    private def existing_user_data
      user.as_json(only: [:id, :email, :first_name, :last_name]).tap do |json|
        json[:avatar_url] = user.avatar&.url
        json[:user_role_name] = user.user_role_name
        json[:master_token_enabled] = user.api_key.present?
        json[:master_token] = user.api_key.key if user.api_key.present?
        json[:superadmin] = user.superadmin?

        if user.member?
          json[:editable_member] = true # special flag used in UI logic
          json[:company_id] = user.company.id
          json[:phone] = user.phone
          json[:member_role_type] = user.role_type
          json[:payroll] = user.payroll
          json[:cost_centre] = user.cost_centre
        end
      end
    end

    private def user_companyadmin?
      user.try(:companyadmin?)
    end

    private def companies
      DB[:companies]
        .inner_join(:company_infos, company_id: :id, active: true)
        .where(:companies[:active] => true, :companies[:company_type] => Company::Type::ENTERPRISE)
        .order(:name)
        .select(
          :companies[:id],
          :name,
          :companies[:payroll_required],
          :companies[:cost_centre_required]
        )
        .all
    end
  end
end
