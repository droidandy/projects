# == Schema Information
#
# Table name: agent_statuses
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  status     :integer          not null
#  current    :boolean          default(TRUE), not null
#  created_at :datetime         not null
#  ended_at   :datetime
#

require 'rails_helper'

RSpec.describe AgentStatus do
  describe 'unique current status validation' do
    let(:user) { create(:user) }

    before do
      create(:agent_status, user: user, current: false, ended_at: Time.current)
      create(:agent_status, user: user, current: true)
    end

    it 'ensures agent has only one current status' do
      expect(build(:agent_status, user: user, current: true)).not_to be_valid
    end
  end
end
