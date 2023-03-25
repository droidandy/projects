module UITest
  def self.config
    return @config if defined?(@config)

    variables_config = Rails.root.join('spec.features/support/ui_test/variables.yml')
    raise "#{variables_config} is missing!" unless variables_config.exist?

    @config = YAML.load_file(variables_config.to_s).with_indifferent_access
  end

  def self.email_files(email)
    Dir.glob(Rails.root.join('tmp', 'letter_opener', "#{email}*", 'rich.html'))
  end

  def self.email_file(email)
    email_files(email).last
  end

  def self.get_url_with_token_from_email(email)
    BM.sleep 2
    body = File.read(email_file(email)).gsub(/=\r\n/, '').gsub(/\R+/, '').gsub(/=3D/, '=')
    body.scan(%r{http://localhost:3030/auth/(?:set|reset)\?token=\w+})[0]
  end

  def self.remove_user_records(email)
    User.first(email: email)&.destroy
    paths = email_files(email)
    paths.each(&File.method(:delete))
  end

  def self.create_superadmin
    FactoryGirl.create(
      :user,
      :superadmin,
      email: config[:super_admin][:email],
      password: config[:super_admin][:password],
      password_confirmation: config[:super_admin][:password],
      first_name: 'Admin',
      last_name: 'Super'
    )
  end

  def self.super_admin
    User.first(email: config[:super_admin][:email])
  end

  def self.generate_invoice(company)
    Invoices::Create.new(company: company).execute
  end
end
