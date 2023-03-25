load(Rails.root.join( 'db', 'seeds', 'acl.rb'))
load(Rails.root.join( 'db', 'seeds', 'documents.rb')) unless Rails.env.test?
load(Rails.root.join( 'db', 'seeds', 'admins.rb')) unless Rails.env.test?

# env specific seeds
case Rails.env
when 'development'
  load(Rails.root.join( 'db', 'seeds', "#{Rails.env.downcase}.rb"))
end
