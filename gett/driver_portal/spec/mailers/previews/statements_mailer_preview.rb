class StatementsMailerPreview < ActionMailer::Preview
  def report
    StatementsMailer.report(User.first, zip)
  end

  def share
    StatementsMailer.share(
      User.first,
      zip,
      ['address_1@email.com', 'address_2@email.com'],
      'Lorem Ipsum'
    )
  end

  private def zip
    File.read(Rails.root.join('spec', 'samples', 'files', 'statements.zip'))
  end
end
