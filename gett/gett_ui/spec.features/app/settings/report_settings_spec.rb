require 'features_helper'

feature 'Reports Settings' do
  let(:report_settings_page) { Pages::App.report_settings }
  let(:company)              { create(:company, :enterprise) }
  let(:date)                 { Date.current + 1 }
  let(:time)                 { 10.minutes.from_now }
  let(:hour)                 { time.strftime('%H') }
  let(:minute)               { time.strftime('%M') }

  context 'UI' do
    before do
      login_to_app_as(company.admin.email)
      report_settings_page.load
      expect(report_settings_page).to be_loaded
    end

    scenario 'Create' do
      report_settings_page.add_new_csv_report_button.click
      wait_until_true { report_settings_page.has_add_new_report_modal? }
      modal = report_settings_page.add_new_report_modal

      modal.save_button.click

      expect(modal.name.error_message).to eql("can't be blank")
      expect(modal.recipients.error_message).to eql("can't be blank")

      modal.name.set 'testname'
      modal.repeat.select 'daily'
      modal.date.set date
      modal.time.hours.set hour
      modal.time.minutes.set minute
      modal.delimiter.set ';'
      modal.recipients.set 'fakemail@gmail.com,othermailm,param@gmail.com'
      modal.save_button.click

      expect(modal.recipients.error_message).to eql("Some of recipient email entries are invalid: othermailm")
      expect(modal).to have_text('At least one of the checkboxes must be selected')
      expect(modal).to have_text('Data (0/50)')

      modal.recipients.set 'fakemail@gmail.com,othermail@gmail.com'

      checks = modal.columns.class.mapped_items.map(&:values).flatten
      modal.show_columns.click

      modal.columns.send(checks.first).check
      modal.columns.send(checks.first).uncheck

      # https://gett-uk.atlassian.net/browse/OU-3526
      # expect(modal).to have_text('Data (0/50)')

      checks.each do |checkbox|
        modal.columns.send(checkbox).check
      end
      expect(modal).to have_text('Data (50/50)')

      modal.save_button.click
      wait_until_true { report_settings_page.reports.present? }

      report_settings_page.reload
      wait_until_true { report_settings_page.reports.present? }

      report_settings_page.reports.first.edit_button.click

      wait_until_true { report_settings_page.has_add_new_report_modal? }

      modal = report_settings_page.add_new_report_modal
      expect(modal.name.value).to eql('testname')
      expect(modal.repeat.selected_options).to eql('daily')
      expect(modal.date.value).to eql(date.strftime('%d/%m/%Y'))

      expect(modal.time.hours.selected_options).to eql(hour)
      expect(modal.time.minutes.selected_options).to eql(minute)
      expect(modal.delimiter.value).to eql(';')
      expect(modal.recipients.value).to eql('fakemail@gmail.com,othermail@gmail.com')

      modal.show_columns.click if modal.has_show_columns?

      checks.each do |checkbox|
        expect(modal.columns.send(checkbox)).to be_checked
      end

      modal.name.set ''
      modal.recipients.set ''
      modal.save_button.click

      expect(modal.name.error_message).to eql("can't be blank")
      expect(modal.recipients.error_message).to eql("can't be blank")
      modal.name.set 'superman'
      modal.recipients.set 'fakemail@gmail.com,othermail'

      checks.each do |checkbox|
        modal.columns.send(checkbox).uncheck
      end

      modal.save_button.click
      expect(modal.recipients.error_message).to eql("Some of recipient email entries are invalid: othermail")
      expect(modal).to have_text('At least one of the checkboxes must be selected')

      modal.recipients.set 'fakemail@gmail.com,othermail@gmail.com'
      modal.columns.send(checks.first).check

      modal.repeat.select 'monthly'
      modal.date.set date + 1
      modal.time.hours.set hour
      modal.time.minutes.set minute
      modal.delimiter.set ','

      modal.save_button.click
      wait_until_true { report_settings_page.has_no_add_new_report_modal? }
      wait_until_true { report_settings_page.reports.present? }

      report_settings_page.reports.first.edit_button.click

      wait_until_true { report_settings_page.has_add_new_report_modal? }
      modal = report_settings_page.add_new_report_modal
      expect(modal.name.value).to eql('superman')
      expect(modal.repeat.selected_options).to eql('monthly')
      expect(modal.date.value).to eql((date + 1).strftime('%d/%m/%Y'))

      expect(modal.time.hours.selected_options).to eql(hour)
      expect(modal.time.minutes.selected_options).to eql(minute)
      expect(modal.delimiter.value).to eql(',')
      expect(modal.recipients.value).to eql('fakemail@gmail.com,othermail@gmail.com')

      expect(modal.columns.send(checks.first)).to be_checked

      checks[1..-1].each do |checkbox|
        expect(modal.columns.send(checkbox)).not_to be_checked
      end
    end
  end

  context 'report sending' do
    [:daily, :weekly, :monthly].each do |period|
      context period do
        let(:time_period) do
          case period
          when :daily
            1.day
          when :weekly
            1.week
          when :monthly
            1.month
          end
        end

        let(:report) do
          create(
            :csv_report, period,
            company: company,
            headers: CsvReports::Export::SUPPORTED_HEADERS,
            recurrence_starts_at: start
          )
        end

        let(:start)            { 3.seconds.from_now }
        let(:first_occurrence) { report.next_occurrence }

        scenario 'should be scheduled at correct time' do
          expect(first_occurrence.to_datetime).to be_within(2.seconds).of(start.to_datetime)
          Timecop.travel(report.next_occurrence + 1.second) do
            expect(report.next_occurrence).to be_within(2.seconds).of(start + time_period)
          end
        end
      end
    end
  end

  context 'csv report' do
    let!(:booking)   { create(:booking, :completed, :with_charges, passenger: passenger, booker: company.admin, scheduled_at: 1.month.ago) }
    let(:passenger)  { create(:passenger, company: company) }
    let(:recipients) { Array.new(2).map { Faker::Internet.email }.join(',') }
    let(:headers)    { CsvReports::Export::SUPPORTED_HEADERS.dup.tap { |hash| hash.each { |k, _v| hash[k] = 'true' } } }
    let(:csv_report) { create(:csv_report, recipients: recipients, company: company, headers: headers) }
    let(:email_page) { Pages::EmailPage.new }
    let(:subject)    { 'Your Monthly Gett Business Solutions powered by One Transport Rides CSV file' }
    let(:body)       { email_page.body { |b| b.body.text } }

    let(:expected_body) { "Your Monthly Gett Business Solutions powered by One Transport rides CSV file Dear, Please find attached your Monthly Gett Business Solutions powered by One Transport Rides CSV File. Thank you! Your Gett Business Solutions powered by One Transport" }

    before do
      CsvReportSender.new.perform(csv_report.id)
    end

    def find_report(recipient)
      File.read(
        Dir.glob(File.join(Rails.root, 'tmp/letter_opener', "#{recipient}*", 'attachments/monthly_report.csv')).last
      )
    end

    def find_emails_for_recipient(email)
      Dir.glob(File.join('tmp/letter_opener', "#{email}*", 'rich.html'))
    end

    def parse_csv(recipient)
      CSV.parse(find_report(recipient), headers: true).map(&:to_h)
    end

    let(:expected_hash) do
      {
        "Order ID"                  => booking.service_id.to_s,
        "Company ID"                => company.id.to_s,
        "Company Name"              => company.name,
        "Company Address"           => "167 Fleet St, London EC4A 2EA, UK",
        "Company Email"             => nil,
        "Company Contact"           => nil,
        "Account Manager"           => nil,
        "Billing Terms"             => "30",
        "Scheduled Order Date/Time" => booking.scheduled_at.strftime('%d/%m/%Y %H:%M'),
        "Order Creation Date/Time"  => booking.created_at.strftime('%d/%m/%Y %H:%M'),
        "Arrived At"                => nil,
        "Started At"                => nil,
        "Ended At"                  => nil,
        "Cancelled At"              => nil,
        "Car Type"                  => "BlackTaxi",
        "Pickup Address"            => "167 Fleet St, London EC4A 2EA, UK",
        "Destination Address"       => "221B Baker St, Marylebone, London NW1 6XE, UK",
        "Stop Point 1"              => nil,
        "Stop Point 2"              => nil,
        "Stop Point 3"              => nil,
        "Stop Point 4"              => nil,
        "Payment Type"              => "account",
        "Booker Name"               => booking.booker.full_name,
        "Riding User ID"            => booking.passenger.id.to_s,
        "Riding User Name"          => booking.passenger.full_name,
        "Riding User Department"    => nil,
        "Riding User Work Role"     => nil,
        "Riding User Cost Center"   => nil,
        "Riding User Division"      => nil,
        "Riding User Payroll ID"    => nil,
        "Riding User Email"         => booking.passenger.email,
        "Base Fare"                 => "0.00",
        "Run-in Fee"                => "1.00",
        "Booking Fee"               => "0.00",
        "Phone Booking Fee"         => "0.00",
        "Handling Fee"              => "0.00",
        "International Fee"         => "0.00",
        "Total Fees"                => "0.00",
        "Extra Fee 1"               => "0.00",
        "Extra Fee 2"               => "0.00",
        "Extra Fee 3"               => "0.00",
        "Waiting Time Minutes"      => "0",
        "Waiting Time Cost"         => "0.00",
        "Cancellation Cost"         => "0.00",
        "VAT"                       => "0.00",
        "Final Cost Excl VAT"       => "19.00",
        "Final Cost Incl VAT"       => "19.00",
        "Status"                    => "completed",
        "Reason For Travel"         => nil
      }
    end

    scenario 'should be sent to all recipients' do
      recipients.split(',').each do |recipient|
        wait_until_true(timeout: 40) do
          find_emails_for_recipient(recipient).each do |e|
            email = "file://#{File.join(Rails.root, e)}"
            visit email
            expect(email_page).to be_loaded
            break if email_page.subject.text == subject
          end
          email_page.subject.text == subject
        end
        expect(body).to eql(expected_body)
        expect(email_page.attachment.text).to eql('monthly_report.csv')

        expect(find_report(recipient)).not_to be_empty

        expect(parse_csv(recipient).size).to eql(1)
        expect(parse_csv(recipient).first).to eql(expected_hash)
      end
    end
  end
end
