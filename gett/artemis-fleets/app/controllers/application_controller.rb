require 'json_web_token'

class ApplicationController < ActionController::API
  before_action :authenticate

  def blank
    render plain: ''
  end

  def current_user
    @current_user ||= user_from_token
  end

  def current_company
    @current_user.company
  end

  # pass it to service
  def context
    OpenStruct.new(
      user: current_user,
      company: current_company
    )
  end

  private def authenticate
    head :unauthorized if current_user.blank?
  end

  private def user_from_token
    return if encoded_token.blank? || decoded_token.blank?
    user = User.find(decoded_token[:id])
    return unless user.active?
    user
  end

  private def encoded_token
    @encoded_token ||= if request.headers['Authorization'].present?
                         request.headers['Authorization'].split(' ').last
                       else
                         params[:token]
                       end
  end

  private def decoded_token
    @decoded_token ||= JsonWebToken.decode(encoded_token)
  end
end
