KINDS = [
  {
    owner: :driver,
    mandatory: true,
    slug: 'dvla',
    title: 'Driving Licence (DVLA)',
    definition_class: 'Dvla'
  },
  {
    owner: :driver,
    mandatory: true,
    slug: 'phdl',
    title: 'Private Hire Driving Licence',
    definition_class: 'Phdl'
  },
  {
    owner: :vehicle,
    mandatory: true,
    slug: 'v5_logbook',
    title: 'V5 Logbook',
    definition_class: 'V5Logbook'
  },
  {
    owner: :vehicle,
    mandatory: true,
    slug: 'phvl',
    title: 'Private Hire Vehicle Licence',
    definition_class: 'Phvl'
  },
  {
    owner: :vehicle,
    mandatory: true,
    slug: 'mot',
    title: 'MOT',
    definition_class: 'Mot'
  },
  {
    owner: :vehicle,
    mandatory: true,
    slug: 'insurance',
    title: 'Insurance',
    definition_class: 'Insurance'
  },
  {
    owner: :vehicle,
    mandatory: false,
    slug: 'driver_schedule',
    title: 'Driver Schedule',
    definition_class: 'DriverSchedule'
  },
  {
    owner: :vehicle,
    mandatory: false,
    slug: 'vehicle_schedule',
    title: 'Vehicle schedule',
    definition_class: 'VehicleSchedule'
  },
  {
    owner: :vehicle,
    mandatory: false,
    slug: 'hire_agreement',
    title: 'Hire Agreement',
    definition_class: 'HireAgreement'
  },
  {
    owner: :vehicle,
    mandatory: false,
    slug: 'permission_letter',
    title: 'Permission Letter',
    definition_class: 'PermissionLetter'
  },
  {
    owner: :vehicle,
    mandatory: false,
    slug: 'phvl_back',
    title: 'Back of PHVL',
    definition_class: 'PhvlBack'
  }
].freeze

KINDS.each do |attributes|
  Documents::Kind.find_or_create_by(slug: attributes[:slug]) do |kind|
    kind.owner = attributes[:owner]
    kind.title = attributes[:title]
    kind.mandatory = attributes[:mandatory]
    kind.definition_class = attributes[:definition_class]
  end
end

FIELDS = {
  dvla: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: true },
    { name: 'license_number', field_type: 'str', label: 'Driving license number', mandatory: true },
    { name: 'postcode', field_type: 'str', label: 'Postcode', mandatory: true },
    { name: 'date_of_birth', field_type: 'date', label: 'Date of birth', mandatory: true }
  ],
  phdl: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: true },
    { name: 'license_number', field_type: 'str', label: 'License number', mandatory: true },
    { name: 'postcode', field_type: 'str', label: 'Postcode', mandatory: true },
    { name: 'conditions_met', field_type: 'bool', label: 'Conditions?', mandatory: true }
  ],
  v5_logbook: [
    { name: 'postcode', field_type: 'str', label: 'Postcode of owner', mandatory: true },
    { name: 'registration', field_type: 'str', label: 'Vehicle registration', mandatory: true },
    { name: 'registration_date', field_type: 'date', label: 'Date of first registration', mandatory: true },
    { name: 'acquirement_date', field_type: 'date', label: 'Date vehicle was acquired', mandatory: true },
    { name: 'make', field_type: 'str', label: 'Make', mandatory: true },
    { name: 'model', field_type: 'str', label: 'Model', mandatory: true },
    { name: 'color', field_type: 'str', label: 'Colour', mandatory: true },
    { name: 'taxation_class', field_type: 'str', label: 'Taxation Class', mandatory: true },
    { name: 'is_temporary', field_type: 'bool', label: 'Temporary logbook (Y/N)', mandatory: true },
    { name: 'owner', field_type: 'str', label: 'Owner of vehicle', mandatory: true }
  ],
  phvl: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiry date', mandatory: true },
    { name: 'postcode', field_type: 'str', label: 'Owner postcode', mandatory: true },
    { name: 'registration', field_type: 'str', label: 'Vehicle registration', mandatory: true },
    { name: 'phvl_number', field_type: 'str', label: 'Private hire vehicle licence number', mandatory: true },
    { name: 'number_of_passengers', field_type: 'str', label: 'Licensed to carry passengers number', mandatory: true }
  ],
  mot: [
    { name: 'registration', field_type: 'str', label: 'Vehicle registration', mandatory: true },
    { name: 'make', field_type: 'str', label: 'Make', mandatory: true },
    { name: 'model', field_type: 'str', label: 'Model', mandatory: true },
    { name: 'color', field_type: 'str', label: 'Colour', mandatory: true },
    { name: 'issue_date', field_type: 'date', label: 'Issue date', mandatory: true }
  ],
  insurance: [
    { name: 'expires_at', field_type: 'date_time', label: 'Expiry date & time', mandatory: true },
    { name: 'registration', field_type: 'str', label: 'Vehicle registration', mandatory: true },
    { name: 'insurance_company', field_type: 'str', label: 'Insurance company', mandatory: true },
    { name: 'policyholder', field_type: 'str', label: 'Policyholder', mandatory: true },
    { name: 'limitations', field_type: 'str', label: 'Limitations', mandatory: true }
  ],
  driver_schedule: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: false },
    { name: 'is_driver_named', field_type: 'bool', label: 'Is the driver named on the document?', mandatory: false }
  ],
  vehicle_schedule: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: false },
    { name: 'is_vehicle_stated', field_type: 'bool', label: 'Is the vehicle stated on the document?', mandatory: false }
  ],
  hire_agreement: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: false },
    { name: 'return_date_stated', field_type: 'bool', label: 'Is a return date stated?', mandatory: false }
  ],
  permission_letter: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: false },
    { name: 'return_date_stated', field_type: 'bool', label: 'Is a return date stated?', mandatory: false },
    { name: 'sign_date', field_type: 'date', label: 'Sign date', mandatory: false }
  ],
  phvl_back: [
    { name: 'expiry_date', field_type: 'date', label: 'Expiration date', mandatory: false }
  ]
}.freeze

FIELDS.each do |slug, fields|
  kind = Documents::Kind.find_by(slug: slug)
  fields.each do |attributes|
    kind.fields.create(**attributes)
  end
end
