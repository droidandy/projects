module ControllerHelpers
  def sign_in(user)
    token = JsonWebToken.encode(id: user.id)
    controller.request.headers['Authorization'] = "Bearer #{token}"
  end

  def as_params(hash)
    ActionController::Parameters.new(hash).permit!
  end
end
