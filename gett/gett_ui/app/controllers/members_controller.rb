class MembersController < ApplicationController
  def reinvite
    service = Members::Reinvite.new(member: member)

    if service.execute.success?
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def invite
    service = Members::InviteAll.new

    render json: {channel: service.execute.result}, status: :created
  end

  private def member
    @member ||= current_company.members_dataset.with_pk!(params[:id])
  end
end
