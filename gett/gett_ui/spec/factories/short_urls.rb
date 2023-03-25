FactoryGirl.define do
  factory :short_url do
    original_url 'some_url'
    token { SecureRandom.hex(6) }
  end
end
