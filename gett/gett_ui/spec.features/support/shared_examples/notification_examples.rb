using Sequel::CoreRefinements

shared_examples 'validate email' do |_calendar = false|
  let(:email_page) { Pages::EmailPage.new }
  let(:body)       { email_page.body { |b| b.body.text } }

  it "user receives valid email" do
    wait_until_true(timeout: 40) do
      find_emails_for_recipient(recipient.email).each do |e|
        email = "file://#{File.join(Rails.root, e)}"
        visit email
        expect(email_page).to be_loaded
        break if email_page.subject.text == subject
      end
      email_page.subject.text == subject
    end
    expect(email_page.from.text).to eql('donotreply@gett.com')
    expect(email_page.subject.text).to eql(subject)
    expect(email_page.date.text).to include(Date.today.strftime('%b %-d, %Y'))
    expect(email_page.to.text).to eql(recipient.email)

    verbose "Subject:  #{email_page.subject.text}"
    verbose "Body:     #{body}"
    verbose "Expected: #{expected_body}"
    expect(body).to eql(expected_body)

    if iphone
      expect(email_page.body { |body| body.iphone_app['href'] }).to eql(iphone)
    else
      email_page.body { |body| expect(body).not_to have_iphone_app }
    end

    if android
      expect(email_page.body { |body| body.android_app['href'] }).to eql(android)
    else
      email_page.body { |body| expect(body).not_to have_android_app }
    end
  end
end

shared_examples 'validate sms' do
  let(:sms_to) { recipient.phone.delete(' ') }
  let(:request) do
    wait_until_true(timeout: 40) do
      Request.where(service_provider: 'nexmo', :request_payload.pg_jsonb.get_text('to') => sms_to).find do |r|
        r.request_payload['text'] =~ /#{sms_title}/
      end
    end
  end

  let(:text) { request.request_payload['text'] }

  it "user receives valid sms" do
    expect(request).to be_present
    verbose "SMS: #{text}"
    verbose "Exp: #{sms_text}"
    expect(text).to eql(sms_text)
  end
end
