module StubHelpers
  def json_body(path)
    File.read(Rails.root.join('spec', 'samples', "#{path}.json"))
  end

  def stub_auth(client)
    body = { access_token: 'access_token' }.to_json
    stub_client(client, :auth, body)
  end

  def stub_client(client, method, body, status = 200, response_class: GenericApiResponse)
    allow_any_instance_of(client).to receive(method)
      .and_return(response_class.new(status, body))
  end

  def stub_service(service_name, success = true, **methods)
    default_methods = {
      execute!: nil,
      success?: success,
      errors: {}
    }
    class_double(service_name,
                 new: instance_double(service_name, **default_methods.merge(methods))).as_stubbed_const
  end

  def stub_policy(policy, action, result = true)
    allow_any_instance_of(policy).to receive(action).and_return(result)
  end

  def system_user
    User.find_by(email: Rails.application.secrets.system_user_email)
  end
end
