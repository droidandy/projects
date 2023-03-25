require 'leaderboard'

class ComplianceQueue
  attr_reader :leaderboard, :driver

  def initialize(driver)
    @driver = driver
    @leaderboard = Leaderboard.new('compliance_queue', reverse: true)
  end

  def update_position
    if driver.in_queue? && documents_pending?
      leaderboard.rank_member(driver.id, driver.ready_for_approval_since.to_i)
    else
      leaderboard.remove_member(driver.id)
    end
  end

  def position
    leaderboard.rank_for(driver.id)
  end

  def documents_ready?
    driver.approved_approval_status? && driver.vehicles.visible.approved_approval_status.any?
  end

  def documents_pending?
    driver.documents.pending_approval_status.any?
  end
end
