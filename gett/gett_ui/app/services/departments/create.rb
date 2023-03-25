module Departments
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :department, :params
    delegate :errors, to: :department
    delegate :company, to: :context

    def execute!
      transaction do
        result { create_model(department, department_params) }

        assign_members if department.persisted?
      end
    end

    def show_result
      department.as_json(only: [:id, :name])
    end

    def department
      @department ||= Department.new(company: company)
    end

    private def assign_members
      return unless params.key?(:member_pks)

      DB[:members]
        .where(company_id: company.id, id: assign_member_pks)
        .update(department_id: department.id)
    end

    private def department_params
      params.except(:member_pks)
    end

    private def assign_member_pks
      params[:member_pks]
    end
  end
end
