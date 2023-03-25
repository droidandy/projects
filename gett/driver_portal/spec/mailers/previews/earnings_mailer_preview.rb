class EarningsMailerPreview < ActionMailer::Preview
  def report
    EarningsMailer.report(User.first, csv)
  end

  def share
    EarningsMailer.share(
      User.first,
      csv,
      ['address_1@email.com', 'address_2@email.com'],
      'Lorem Ipsum'
    )
  end

  private def csv
    File.read(Rails.root.join('spec', 'samples', 'files', 'earnings.csv'))
  end
end
