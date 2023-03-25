class Admin::MessagesController < Admin::BaseController
  def index
    render json: Admin::Messages::Index.new(context).execute.result
  end

  def create
    service = Admin::Messages::Create.new(context, {message: message_params})

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def message_params
    params.require(:message).permit(:body)
  end
end
