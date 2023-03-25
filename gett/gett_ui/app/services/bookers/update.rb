module Bookers
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :booker, :params
    delegate :errors, to: :booker

    def execute!
      transaction do
        result { update_model(booker, booker_params) }
        assert { send_invitation } if booker_becomes_onboarding?
        assert { update_model(booker, role_params) } if policy.update_role? && !booker.companyadmin?
      end
    end

    def show_result
      Bookers::AsJson.new(booker: booker, as: :record).execute.result
    end

    private def booker_params
      params.slice(*policy.permitted_booker_params)
        .merge(passenger_pks: policy.permitted_passenger_pks(params[:passenger_pks]))
    end

    private def role_params
      role_type.blank? ? {} : {role: Role[role_type]}
    end

    private def role_type
      params[:role_type].in?(%w(admin booker finance travelmanager)).presence && params[:role_type]
    end

    private def booker_becomes_onboarding?
      previous_changes = booker.previous_changes
      return false if previous_changes.blank? || previous_changes[:onboarding].blank?

      # first - previous value, last - new value
      !previous_changes[:onboarding].first && previous_changes[:onboarding].last
    end

    private def send_invitation
      MembersMailer.invitation(booker.id).deliver_later
    end
  end
end
