class MessagesController < ApplicationController
  def create
    service = Messages::Create.new(context, {message: message_params })

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def mark_all_as_read
    Messages::MarkAllAsRead.new(context).execute
    head :ok
  end

  def unread
    service = Messages::Unread.new(context).execute
    render json: service.result
  end

  private def message_params
    params.require(:message).permit(:body)
  end
end
