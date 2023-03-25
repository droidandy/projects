class Companies::SynchronizeSftp < ApplicationService
  include ApplicationService::Policy
  include ApplicationService::Context

  delegate :company, to: :context

  def execute!
    ::SftpWorker.perform_async(company.id)

    success!
  end
end
