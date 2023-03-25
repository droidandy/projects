module WorkRoles
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :work_role, :params
    delegate :errors, to: :work_role
    delegate :company, to: :context

    def execute!
      transaction do
        result { create_model(work_role, work_role_params) }

        assign_members if work_role.persisted?
      end
    end

    def show_result
      work_role.as_json(only: [:id, :name])
    end

    def work_role
      @work_role ||= WorkRole.new(company: company)
    end

    private def assign_members
      return unless params.key?(:member_pks)

      DB[:members]
        .where(company_id: company.id, id: assign_member_pks)
        .update(work_role_id: work_role.id)
    end

    private def work_role_params
      params.except(:member_pks)
    end

    private def assign_member_pks
      params[:member_pks]
    end
  end
end
