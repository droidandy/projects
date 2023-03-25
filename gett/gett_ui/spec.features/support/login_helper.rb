module LoginHelper
  def login_as(email, password = 'P@ssword', realm: 'app')
    uri = URI(Capybara.app_host)
    http = Net::HTTP.new(uri.hostname, uri.port)
    params = {user: { email: email, password: password, captcha_response: nil}}.to_json
    resp = http.post('/api/session', params, 'Content-Type' => 'application/json')
    token = JSON(resp.body)['token']
    visit '/assets/images/no-company-logo.png'
    page.execute_script "window.localStorage.setItem('authToken', '#{token}')"
    page.execute_script "window.localStorage.setItem('authRealm', '#{realm}')"
    path =
      case realm
      when 'app', 'affiliate'
        '/'
      when 'admin'
        '/admin'
      end

    if block_given?
      yield
    else
      visit path
    end
  end

  def login_to_app_as(email, password = 'P@ssword', &block)
    login_as(email, password, realm: 'app', &block)
  end

  def login_to_admin_as(email, password = 'P@ssword', &block)
    login_as(email, password, realm: 'admin', &block)
  end

  def login_to_affiliate_as(email, password = 'P@ssword', &block)
    login_as(email, password, realm: 'affiliate', &block)
  end

  def login_as_super_admin(&block)
    login_as(UITest.config[:super_admin][:email], UITest.config[:super_admin][:password], realm: 'admin', &block)
  end
end
