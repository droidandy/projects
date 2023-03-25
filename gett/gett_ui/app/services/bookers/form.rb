module Bookers
  class Form < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :booker

    delegate :company, to: :context

    def execute!
      {
        booker: booker_data,
        passengers: passengers_data,
        work_roles: company.work_roles.as_json(only: [:id, :name]),
        departments: company.departments.as_json(only: [:id, :name]),
        can: {
          edit_all: policy.edit_all?,
          change_role: policy.change_role? && !booker&.companyadmin?,
          change_active: policy.change_active?,
          see_log: booker.present? && policy.see_log?,
          assign_passengers: policy.assign_passengers?,
          change_email: policy.change_email?,
          change_department: policy.change_department?,
          change_work_role: policy.change_work_role?,
          reinvite: booker&.persisted? && booker.last_logged_in_at.blank?
        }
      }
    end

    def booker_data
      if booker.present?
        ::Bookers::AsJson.new(booker: booker, as: :record).execute.result
      else
        { active: true, role_type: :booker, passenger_pks: [], assigned_to_all_passengers: false }
      end
    end

    def passengers_data
      policy_scope(:passengers).by_name
        .as_json(only: [:id, :first_name, :last_name])
    end
  end
end
