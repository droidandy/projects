Administrator.find_or_create_by!(email: 'admin@example.com') do |admin|
  admin.password = 'Secure_Password'
end

address = Address.find_or_create_by!(line: '1 MainTest str.') do |a|
  a.lat = 1.0
  a.lng = 1.0
  a.postal_code = 'A1 A11'
end

contact = Contact.find_or_create_by!(email: 'contact1@example.com') do |c|
  c.first_name = 'John'
  c.last_name = 'Doe'
  c.phone = '123456'
  c.mobile = '123456'
  c.fax = '123456'
  c.address = address
end

company = Company.find_or_create_by!(name: 'ACME Test Corp') do |c|
  c.active = true
  c.address = address
  c.fleet_id = 4
  c.primary_contact = contact
  c.billing_contact = contact
end

Member.find_or_create_by!(email: 'member_admin@example.com') do |user|
  user.first_name = 'John'
  user.last_name = 'Doe'
  user.company = company
  user.phone = '1 2345 678 910'
  user.mobile = '1 2345 678 910'
  user.role = 'admin'
  user.password = 'Secure_Password'
end

Member.find_or_create_by!(email: 'member_user@example.com') do |user|
  user.first_name = 'John'
  user.last_name = 'Doe'
  user.company = company
  user.phone = '1 2345 678 910'
  user.mobile = '1 2345 678 910'
  user.role = 'user'
  user.password = 'Secure_Password'
end

[
  { first_name: 'Andy', last_name: 'Brown' },
  { first_name: 'Rikus', last_name: 'Louw' },
  { first_name: 'Wesley', last_name: 'Bishop' },
  { first_name: 'Richard', last_name: 'Donkor' },
  { first_name: 'Andrew', last_name: 'Caldwell' },
  { first_name: 'Nav', last_name: 'Dhinsa' },
  { first_name: 'Mitch', last_name: 'Loan' },
  { first_name: 'Jason', last_name: 'Baaphy' },
  { first_name: 'Shay', last_name: 'Priove' },
  { first_name: 'Andrew', last_name: 'Laughlan' },
  { first_name: 'Mark', last_name: 'Boyes' },
  { first_name: 'Gavin', last_name: 'Padden' },
  { first_name: 'Marsha', last_name: 'Miles' },
  { first_name: 'Kylie', last_name: 'Gradley' },
  { first_name: 'Chris', last_name: 'Constantinou' },
  { first_name: 'Ian', last_name: 'Campbell Gray' },
  { first_name: 'Andreas', last_name: 'Georgiou' },
  { first_name: 'Claire', last_name: 'O\'Shea' },
  { first_name: 'Roy', last_name: 'Hughes' },
  { first_name: 'Annalisa', last_name: 'Piazzolla' }
].each { |salesman| Salesman.find_or_create_by!(salesman) }
