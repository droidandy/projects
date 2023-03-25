class Contact < ApplicationRecord
  belongs_to :address, optional: true
end
