module HomePrivacy
  module SequelRefinements
    refine Sequel::SQL::QualifiedIdentifier do
      def sanitize_using(address_type_column)
        return self unless HomePrivacy.sanitize?

        Sequel.case({'home' => HOME}, self, address_type_column)
      end
    end
  end
end
