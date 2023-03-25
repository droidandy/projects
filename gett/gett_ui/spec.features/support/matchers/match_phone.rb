RSpec::Matchers.define :match_phone do |expected|
  match do |actual|
    expected.delete('^+0-9') == actual.delete('^+0-9')
  end
end
