class ApplicationController < ActionController::API
  include Pundit

  AUTHENTICATION_ERROR = Errors.new(access_token: 'is expired or wrong').freeze

  rescue_from Pundit::NotAuthorizedError do
    head 404
  end

  rescue_from Parascope::GuardViolationError do
    head 422
  end

  rescue_from ActiveRecord::RecordNotFound do
    head 404
  end

  rescue_from JWT::DecodeError do
    render json: AUTHENTICATION_ERROR.as_json, status: :unauthorized
  end

  before_action :extract_access_token_from_headers

  protected def execute_and_process(service, success_status: :ok, error_opts: {})
    service.execute!
    if service.success?
      if block_given?
        yield
      else
        head success_status
      end
    else
      render json: Errors.new(service.errors, error_opts).as_json, status: 422
    end
  end

  protected def extract_access_token_from_headers
    return if request.headers['Authorization'].blank?
    params[:authorization] ||= request.headers['Authorization']
    params[:admin_authorization] ||= request.headers['Admin-Authorization']
  end

  protected def authenticate_user!
    return if current_user.present?
    render json: AUTHENTICATION_ERROR.as_json, status: :unauthorized
  end

  protected def current_admin
    return @current_admin if defined?(@current_admin)
    @current_admin = decode_user(params[:admin_authorization])
  end

  protected def current_user
    return @current_user if defined?(@current_user)
    @current_user = decode_user(params[:authorization])
  end

  protected def permitted(name = nil)
    hash = (name ? params[name] : params).try(:permit!) || {}
    permitted_params = {}
    hash.each do |key, val|
      permitted_params[key.to_sym] = val if val.present?
    end
    yield permitted_params if block_given?
    permitted_params
  end

  def try_date(value)
    Date.parse(value)
  rescue ArgumentError, TypeError
    value
  end

  def try_datetime(value)
    Time.zone.parse(value)
  rescue ArgumentError, TypeError
    nil
  end

  protected def decode_user(token)
    service = Sessions::Current.new(access_token: token)
    service.execute!
    service.user if service.success?
  end
end
