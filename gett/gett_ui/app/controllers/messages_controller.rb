class MessagesController < ApplicationController
  def create
    service = Messages::CreateInternal.new(params: message_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def mark_all_as_read
    Messages::MarkAllAsRead.new.execute
    head :ok
  end

  def unread
    service = Messages::Unread.new.execute
    render json: service.result
  end

  private def message_params
    params.require(:message).permit(:body)
  end
end
