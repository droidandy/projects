RSpec.describe Gett::Template do
  it 'has a version number' do
    expect(Gett::Template::VERSION).not_to be nil
  end
  it 'has a core gem version number' do
    expect(Gett::Template::Example.core_version).not_to be nil
  end
end
