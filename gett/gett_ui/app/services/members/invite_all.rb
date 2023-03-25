module Members
  class InviteAll < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::Background

    background_attributes :company_id

    def execute!
      send_to_background(company_id: context.company.id)
    end

    def background_execute!
      invite_members

      {
        total_members_count: members_dataset.count,
        invited_members_count: yet_to_invite_members.size
      }
    end

    private def company
      @company ||= Company.with_pk!(company_id)
    end

    private def invite_members
      yet_to_invite_members.each do |member|
        fail_safe(subject: member) { Reinvite.new(member: member, onboard: true).execute }
      end
    end

    private def yet_to_invite_members
      @yet_to_invite_members ||= members_dataset.yet_to_invite.all
    end

    private def members_dataset
      @members_dataset ||= company.members_dataset
    end
  end
end
