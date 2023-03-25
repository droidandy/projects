module Admin::Users
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :user, :params

    delegate :error, to: :user

    def self.policy_class
      Admin::Users::Policy
    end

    def execute!
      transaction do
        if user.member?
          result { update_model(user, full_params) }
        elsif !assign_member?
          result { update_model(user, user_params) }
        else
          result { create_member! }
          assert { update_model(user, user_params, kind: 'Member') }
          assert { Member[user.id].valid? }
        end
        assert { update_api_key }
      end
    end

    def create_member!
      DB[:members].returning.insert(member_params.to_hash.merge(id: user.id))
    end

    private def assign_member?
      params[:company_id].present?
    end

    private def full_params
      user_params.merge(member_params)
    end

    private def user_params
      params.slice(:first_name, :last_name, :email, :avatar).merge(
        user_role_id: Role[params[:user_role_name]]&.id
      )
    end

    private def member_params
      params.slice(:phone, :payroll, :cost_centre).tap do |prms|
        unless user.try(:companyadmin?)
          prms[:company_id] = params[:company_id]
          prms[:member_role_id] = Role[params[:member_role_type]]&.id
        end
      end
    end

    private def update_api_key
      if params[:master_token_enabled]
        user.api_key || create_model(ApiKey.new, user: user)
      else
        user.api_key&.destroy
      end
      true
    end
  end
end
