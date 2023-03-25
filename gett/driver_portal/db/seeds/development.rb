BADGE_TYPES = %w[yellow black].freeze
DEV_PASSWORD = 'TestAccount123'.freeze

site_admin = User.with_role(:site_admin).first

ActiveRecord::Base.transaction do # rubocop:disable Metrics/BlockLength
  20.times do |tick| # rubocop:disable Metrics/BlockLength
    first_name = FFaker::Name.first_name
    last_name = FFaker::Name.last_name
    service = Users::Create.new(
      nil,
      account_number:        Random.rand(1_000_000).to_s,
      address:               FFaker::AddressUK.street_address,
      badge_number:          Random.rand(1_000_000).to_s,
      badge_type:            BADGE_TYPES.sample,
      blocked_at:            [nil, FFaker::Time.between(Time.current - 1.month, Time.current).iso8601].sample,
      city:                  FFaker::AddressUK.city,
      email:                 "#{first_name}_#{last_name}_#{tick}@email.com",
      gett_id:               Random.rand(1_000_000),
      name:                  "#{first_name} #{last_name}",
      password_confirmation: DEV_PASSWORD,
      password:              DEV_PASSWORD,
      phone:                 FFaker::PhoneNumber.short_phone_number,
      postcode:              FFaker::AddressUK.postcode,
      sort_code:             Random.rand(1_000_000).to_s,
      role: Role::DRIVERS.sample
    )

    service.execute!
    user = service.user

    case tick % 4
    when 0
      FactoryBot.create :invite, user: user, sender: site_admin
    when 1
      FactoryBot.create :invite, :expired, user: user, sender: site_admin
    when 2
      FactoryBot.create :invite, :accepted, user: user, sender: site_admin
    end

    puts "Welcome, #{user.name}" # rubocop:disable Rails/Output
  end
end

ActiveRecord::Base.transaction do
  365.times do |i|
    se = StatisticsEntry.find_or_create_by date: (Date.parse('2017-03-01') + i.days)
    se.update active_users: i, login_count: i * 2
  end
end

10.times do
  ActiveRecord::Base.transaction do
    views_count = (0..100).to_a.sample
    news_item = News::Item.create do |item|
      item.title          = FFaker::DizzleIpsum.phrase
      item.published_at   = FFaker::Time.between(Time.current - 1.week, Time.current + 1.week)
      item.author         = User.order('RANDOM()').first
      item.comments_count = (1..100).to_a.sample
      item.views_count    = views_count
      item.item_type      = News::Item::TYPES.sample
      if item.item_type.to_s == 'numbers'
        item.number = (1..100).to_a.sample
      else
        item.content = FFaker::HTMLIpsum.fancy_string
        item.image = File.open(Rails.root.join('spec', 'samples', 'files', 'news_image.jpg'))
      end
    end

    (0..10).to_a.sample.times do
      news_item.comments.create user: User.order('RANDOM()').first, content: FFaker::DizzleIpsum.phrase
    end

    views_count.times do
      news_item.views.create user: User.order('RANDOM()').first,
                             created_at: FFaker::Time.between(Time.current - 2.months, Time.current)
    end

    puts "#{news_item.title} created" # rubocop:disable Rails/Output
  end
end

apollo_drivers = User.joins(:roles).where(roles: { name: :apollo_driver })

def document_file
  name = ['pdf-sample.pdf', 'driver_license.jpg'].sample
  File.open(Rails.root.join('spec', 'samples', 'files', name))
end

ActiveRecord::Base.transaction do
  Documents::Kind.where(owner: :driver).each do |kind|
    apollo_drivers.last.documents.create kind: kind,
                                         file: document_file,
                                         expires_at: FFaker::Time.between(Time.current + 1.month, Time.current + 1.year)
  end
end

ActiveRecord::Base.transaction do
  3.times do
    vehicle = apollo_drivers.last.vehicles.create model: "#{FFaker::Vehicle.make} #{FFaker::Vehicle.model}",
                                                  color: FFaker::Vehicle.base_color,
                                                  title: FFaker::Product.product_name,
                                                  plate_number: ('A'..'Z').to_a.sample(6).join

    Documents::Kind.where(owner: :vehicle).each do |kind|
      vehicle.documents.create kind: kind,
                               user: vehicle.user,
                               file: document_file,
                               expires_at: FFaker::Time.between(Time.current + 1.month, Time.current + 1.year)
    end
  end
end

apollo_drivers.each do |driver|
  driver.update onboarding_step: 6
  driver.review.update scheduled_at: FFaker::Time.between(Time.current + 1.day, Time.current + 1.month)
end

puts "Apollo users IDs: #{apollo_drivers.ids.to_sentence}" # rubocop:disable Rails/Output
