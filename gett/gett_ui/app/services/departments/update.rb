module Departments
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :department, :params
    delegate :errors, to: :department
    delegate :company, to: :context

    def execute!
      transaction do
        result { update_model(department, department_params) }

        assign_members
      end
    end

    def show_result
      department.as_json(only: [:id, :name])
    end

    private def assign_members
      return unless params.key?(:member_pks)

      DB[:members]
        .where(company_id: company.id)
        .update(department_id: Sequel.case({{id: assign_member_pks} => department.id, {id: revoke_member_pks} => nil}, :department_id))
    end

    private def department_params
      params.except(:member_pks)
    end

    private def assign_member_pks
      params[:member_pks].map(&:to_i)
    end

    private def revoke_member_pks
      department.member_pks - assign_member_pks
    end
  end
end
