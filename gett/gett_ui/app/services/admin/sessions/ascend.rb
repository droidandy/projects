class Admin::Sessions::Ascend < ApplicationService
  include ApplicationService::Context

  delegate :admin, to: :context

  def execute!
    {token: JsonWebToken.encode(id: admin.id), realm: 'admin'}
  end
end
