module Bookers
  class Create < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods
    include ApplicationService::Policy

    attributes :params
    delegate :company, to: :context
    delegate :errors, to: :booker

    def execute!
      transaction do
        result { create_model(booker, booker_params) }
        assert { booker.set_reset_password_token! }
      end

      send_invitation if success? && onboarding?
    end

    def booker
      @booker ||= Member.new(
        company: company,
        role: Role[role_type],
        notify_with_sms: true,
        notify_with_email: true,
        notify_with_push: true
      )
    end

    private def onboarding?
      booker&.onboarding
    end

    private def booker_params
      params.except(:role_type)
    end

    private def role_type
      params[:role_type].in?(%w(admin booker finance travelmanager)).presence && params[:role_type]
    end

    private def send_invitation
      MembersMailer.invitation(booker.id).deliver_later
    end
  end
end
