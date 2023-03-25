RSpec::Matchers.define :validate_email do |attr|
  match do
    expect(subject).to validate_format(Sequel::Plugins::ApplicationModel::EMAIL_FORMAT, attr)
  end

  failure_message do
    "Expected #{described_class} to use :validates_email validation on #{attr} but didn't"
  end
end
