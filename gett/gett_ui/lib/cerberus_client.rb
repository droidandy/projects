require 'erb'
require 'rest-client'

class CerberusClient
  TIMEOUT = 5 # seconds

  def create_directory(name)
    perform_request('create_directory', directory: name)
  end

  def create_user(username, password, directory)
    perform_request('create_user', username: username, password: password, directory: directory)
  end

  private def settings
    Settings.cerberus
  end

  private def perform_request(operation, params)
    assigns = params.merge(
      soap_username: settings.soap_username,
      soap_password: settings.soap_password
    )
    body = render_template(operation, assigns)
    RestClient.post(settings.soap_endpoint, body, content_type: :xml, timeout: TIMEOUT)
  end

  private def render_template(name, assigns)
    template_path = Rails.root.join('lib', 'cerberus', "#{name}.xml.erb")
    template = File.read(template_path)
    ERB.new(template).result(OpenStruct.new(assigns).instance_eval{ binding })
  end
end
