txtred=$(tput setaf 1)
txtgreen=$(tput setaf 2)
txtyellow=$(tput setaf 3)
txtgray=$(tput setaf 7)
txtreset=$(tput sgr0) 

if [ -d "src" ]; then
  echo -e "${txtyellow}src folder exists.  Checking git status...${txtreset}"
  cd src/broker/be/common-data-lib
  echo -e "${txtreset}Status of ${txtyellow}common-data-lib${txtreset}"
  git status
  cd ../data-persistence-lib
  echo -e "${txtreset}Status of ${txtyellow}data-persistence-lib${txtreset}"
  git status
  cd ../core-application-service
  echo -e "${txtreset}Status of ${txtyellow}core-application-service${txtreset}"
  git status
  cd ../../proxy/reverse-proxy
  echo -e "${txtreset}Status of ${txtyellow}reverse-proxy${txtreset}"
  git status
  cd ../../fe/benrevo-react
  echo -e "${txtreset}Status of ${txtyellow}benrevo-react${txtreset}"
  git status
  cd ../../../superadmin/fe/benrevo-admin-site
  echo -e "${txtreset}Status of ${txtyellow}benrevo-admin-site${txtreset}"
  git status
  cd ../../be/benrevo-admin-service
  echo -e "${txtreset}Status of ${txtyellow}benrevo-admin-service${txtreset}"
  git status
  cd ../../../misc/deploy-helper
  echo -e "${txtreset}Status of ${txtyellow}deploy-helper${txtreset}"
  git status
  cd ../users-admin
  echo -e "${txtreset}Status of ${txtyellow}users-admin${txtreset}"
  git status
  cd ../../..
  echo -e "${txtgreen}Finished checking src folder${txtreset}"
fi

if [ ! -d "src" ]; then
  echo -e "${txtgreen}src folder does not exist yet${txtreset}"
fi

