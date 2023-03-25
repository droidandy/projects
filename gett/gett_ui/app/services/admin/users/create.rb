module Admin::Users
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context

    attributes :params

    def execute!
      if create_member? || member.persisted?
        result { save_model(member, full_params) }
        assert { member.user_role_id.present? }
      else
        create_model(user, user_params)
      end
    end

    private def user
      @user ||= User.new
    end

    private def member
      @member ||= Member.first(email: params[:email]) || Member.new
    end

    private def create_member?
      params[:company_id].present?
    end

    private def full_params
      user_params.merge(member_params)
    end

    private def user_params
      params.slice(
        :password, :password_confirmation, :first_name,
        :last_name, :email, :avatar, :payroll, :cost_centre
      ).merge(user_role_id: Role[params[:user_role_name]]&.id)
    end

    private def member_params
      params.slice(:phone, :company_id).merge(
        member_role_id: Role[params[:member_role_type]]&.id
      )
    end
  end
end
