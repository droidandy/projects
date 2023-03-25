require 'rails_helper'

RSpec.describe ShortUrls::Show, type: :service do
  describe '#execute' do
    let(:short_url) { create :short_url }
    let(:service) { ShortUrls::Show.new(token: short_url.token) }

    subject { service.execute.result }

    it { is_expected.to eq short_url.as_json }
  end
end
