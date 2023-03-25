# Preview all emails at http://localhost:3000/rails/mailers/support_requests
class SupportRequestsPreview < ActionMailer::Preview
  def contact_us
    SupportRequestsMailer.contact_us(User.first, 'Lorem Ipsum')
  end
end
