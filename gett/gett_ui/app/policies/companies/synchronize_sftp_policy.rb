class Companies::SynchronizeSftpPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
