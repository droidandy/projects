module Members
  class Reinvite < ApplicationService
    include ApplicationService::ModelMethods

    attributes :member, :onboard

    def execute!
      return unless member.active?

      transaction do
        result { member.set_reset_password_token! }
        assert { update_model(member, onboarding: true) } if onboard
      end
      MembersMailer.invitation(member.id).deliver_later if success?
    end
  end
end
