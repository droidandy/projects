require 'presenter_for'

class ApplicationService < Performify::Base
  include PresenterFor

  def authorize!(record, query = default_authorization_query, policy_class = nil, user: @current_user)
    record_policy = policy_class ? policy_class.new(user, record) : policy(record, user)
    return if record_policy.public_send(query)

    raise Pundit::NotAuthorizedError, query: query, record: record, policy: record_policy
  end

  def authorize_admin!(record, query = default_authorization_query, policy_class = nil)
    authorize!(record, query, policy_class, user: @admin)
  end

  protected def default_authorization_query
    @default_query ||= "#{self.class.name.demodulize.underscore.to_sym}?"
  end

  protected def policy(record, user = @current_user)
    @policy ||= Pundit.policy!(user, record)
  end

  protected def compose(service, variable = nil, as: variable, pass_errors: true)
    service.execute!
    if service.success?
      value = variable ? service.send(variable) : true
      instance_variable_set("@#{as}", value) if as
      value
    else
      fail!(errors: service.errors) if pass_errors
      nil
    end
  end

  protected def system_user
    User.find_by(email: Rails.application.secrets.system_user_email)
  end

  protected def process_response(response)
    if response.success?
      response.body
    else
      fail!(errors: { data: 'was not retrieved' })
      nil
    end
  end

  protected def gather_attributes(*attributes_list)
    result = {}
    attributes_list.each do |attribute|
      value = send(attribute)
      result[attribute.to_sym] = value if value
    end
    yield result if block_given?
    result
  end
end
