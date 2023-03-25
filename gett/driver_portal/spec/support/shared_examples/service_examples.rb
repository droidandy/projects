RSpec.shared_examples 'it uses policy' do |policy, action|
  it 'fails' do
    stub_policy(policy, action, false)
    expect { subject.execute! }.to raise_error(Pundit::NotAuthorizedError)
  end

  before { stub_policy(policy, action) }
end
