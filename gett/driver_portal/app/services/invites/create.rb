module Invites
  class Create < ApplicationService
    attr_reader :invite

    schema do
      required(:user_id).filled(:int?)
    end

    def execute!
      @invite = current_user.sent_invites.build(
        user: user,
        token_digest: digest,
        step: step
      )

      authorize! @invite

      super do
        if @invite.save
          invalidate_previous_invites!
        end
      end
    end

    on_success :send_email
    on_fail { errors!(invite.errors.to_h) if invite.present? }

    def token
      @token ||= SecureRandom.urlsafe_base64
    end

    def digest
      @digest ||= Digest::SHA256.hexdigest(token)
    end

    private def invalidate_previous_invites!
      existing_invites.find_each do |invite|
        invite.update!(expires_at: Time.current)
      end

      true
    end

    private def send_email
      return if user.blank? || invite.blank?
      UsersMailer.invite(user, token).deliver_now
    end

    private def existing_invites
      @existing_invites ||= begin
        search = Invites::Search.new({ active: true, user: user }, current_user: user)
        search.execute { |scope| scope.where.not(id: invite.id) }
      end
    end

    private def user
      @user ||= begin
        search = Users::Search.new({ id: user_id }, current_user: current_user)
        search.one
      end
    end

    private def step
      user&.admin? || user&.has_any_role?('apollo_driver') ? :password : Invite.steps.keys.first
    end
  end
end
