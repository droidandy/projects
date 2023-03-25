require 'json_web_token'

class SessionsController < AuthenticatedController
  skip_before_action :authenticate, only: [:create, :token]

  def realm
    available = (current_user.realms + [current_member&.realm]).compact
    realm = params[:target].in?(available) ? params[:target] : available.first

    render json: {realm: realm}
  end

  def show
    render json: Sessions::Current.new(member: current_member, user: current_user).execute.result
  end

  def create
    service = Sessions::Create.new(params: user_params, api_type: api_type)

    if service.execute.success?
      render json: service.result
    else
      render json: {error: service.errors}, status: :unauthorized
    end
  end

  def onboard
    service = Sessions::Onboard.new(member: current_user)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def token
    token = params.require(:token)

    if User.active.where(reset_password_token: token).present?
      head :ok
    else
      head :not_found
    end
  end

  private def user_params
    params.fetch(:user, {}).permit(:email, :password, :captcha_response)
  end

  private def api_type
    request.headers['X-API-Type']
  end
end
