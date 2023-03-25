module Invites
  class Show < ApplicationPresenter
    attr_reader :invite

    def initialize(invite)
      @invite = invite
    end

    def as_json(with_user: false)
      convert_to_json(invite, only: %i[id created_at updated_at step]) do |json|
        json[:expires_at] = invite.expires_at if invite.expires_at.present?
        json[:accepted_at] = invite.accepted_at if invite.accepted_at.present?
        json[:user] = presenter_for(invite.user).as_json if with_user
      end
    end
  end
end
