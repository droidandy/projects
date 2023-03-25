class CompanySettings::ShowPolicy < ServicePolicy
  allow_all!

  def edit?
    member.executive?
  end

  def see_sftp_options?
    policy(Companies::SynchronizeSftpPolicy).execute?
  end
end
