RSpec::Matchers.define :validate_phone_number do |attr|
  match do
    allow(subject).to receive(:validates_phone_number)
    subject.valid?
    expect(subject).to have_received(:validates_phone_number).with(attr, any_args)
  end

  failure_message do
    "Expected #{described_class} to call :validates_phone_number but didn't"
  end
end
