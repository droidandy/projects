#!/usr/bin/env bash

GEM_NAME=$(tr '[:upper:]' '[:lower:]' <<< $1)
GEM_NAME_CAPITALIZED=$(tr '[:lower:]' '[:upper:]' <<< ${GEM_NAME:0:1})${GEM_NAME:1}
cp -r gett-template gett-${GEM_NAME}
mv gett-${GEM_NAME}/gett-template.gemspec gett-${GEM_NAME}/gett-${GEM_NAME}.gemspec
mv gett-${GEM_NAME}/lib/gett-template.rb gett-${GEM_NAME}/lib/gett-${GEM_NAME}.rb
mv gett-${GEM_NAME}/lib/gett/template.rb gett-${GEM_NAME}/lib/gett/${GEM_NAME}.rb
mv gett-${GEM_NAME}/lib/gett/template gett-${GEM_NAME}/lib/gett/${GEM_NAME}
mv gett-${GEM_NAME}/spec/gett/template_spec.rb gett-${GEM_NAME}/spec/gett/${GEM_NAME}_spec.rb
find gett-${GEM_NAME} -type f \( -name '*.rb' -o -name '*.gemspec' -o -name '*.md' \) -print0 | xargs -0 sed -i '' "s/template/${GEM_NAME}/g;s/Template/${GEM_NAME_CAPITALIZED}/g"
