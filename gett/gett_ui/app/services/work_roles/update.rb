module WorkRoles
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :work_role, :params
    delegate :errors, to: :work_role
    delegate :company, to: :context

    def execute!
      transaction do
        result { update_model(work_role, work_role_params) }

        assign_members
      end
    end

    private def assign_members
      return unless params.key?(:member_pks)

      DB[:members]
        .where(company_id: company.id)
        .update(work_role_id: Sequel.case({{id: assign_member_pks} => work_role.id, {id: revoke_member_pks} => nil}, :work_role_id))
    end

    def show_result
      work_role.as_json(only: [:id, :name])
    end

    private def work_role_params
      params.except(:member_pks)
    end

    private def assign_member_pks
      params[:member_pks].map(&:to_i)
    end

    private def revoke_member_pks
      work_role.member_pks - assign_member_pks
    end
  end
end
