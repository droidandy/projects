require 'session'

module Invites
  class Update < ApplicationService
    attr_reader :session

    schema do
      required(:token).filled(:str?)
      optional(:password).maybe(:str?)
      optional(:password_confirmation).maybe(:str?)
    end

    def execute!
      if invite.blank?
        return fail!(errors: { token: 'is invalid or expired' })
      end

      super do
        if invite.password_step?
          user.password = (password if password.present?)
          user.password_confirmation = password_confirmation.to_s
          user.save!
        end

        ok = bump_step!

        if invite.accepted_step?
          invite.accepted_at = Time.current
          invite.save!
        end

        ok
      end
    end

    on_fail { errors!(invite.errors.to_h) if invite.present? }
    on_fail { errors!(invite.user.errors.to_h) if invite.present? }
    on_success { create_session if invite.accepted_step? }
    on_success { Statistics::Record.new(system_user, type: :active_users).execute! if invite.accepted_step? }

    def create_session
      @session = Session.new(Session.encoded_user(invite.user))
      @session.touch # rubocop:disable Rails/SkipsModelValidations
    end

    def invite
      @invite ||= begin
        search = Invites::Search.new({ active: true, digest: digest }, current_user: current_user)
        search.one
      end
    end

    def user
      invite.user if invite.present?
    end

    private def bump_step!
      next_step_name =
        if user.admin? || user.has_any_role?('apollo_driver')
          :accepted
        else
          Invite.steps.key(Invite.steps[invite.step] + 1)
        end
      return true if next_step_name.nil?
      invite.public_send("#{next_step_name}_step!")
    end

    private def digest
      @digest ||= Digest::SHA256.hexdigest(token)
    end
  end
end
