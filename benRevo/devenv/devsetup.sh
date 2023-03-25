txtred=$(tput setaf 1)
txtgreen=$(tput setaf 2)
txtyellow=$(tput setaf 3)
txtgray=$(tput setaf 7)
txtreset=$(tput sgr0) 
./gitstatus.sh
echo " "
echo -e "${txtyellow}Your git status is above.  This will move your existing source folder to backup-src and re-clone github repos into src.${txtreset}"
read -p "${txtred}Are you sure?${txtreset} " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo ""
  if [ -d "src" ]; then
    echo -e "${txtyellow}Backing up your src folder to backup-src...${txtreset}"
    rm -rf src.backup
    mv src backup-src
    echo -e "${txtgreen}Done backing up src folder to backup-src.${txtreset}"
  fi

  if [ ! -d "src" ]; then
    echo -e "${txtgreen}The src folder doesn't exist yet.  Nothing to backup.${txtreset}"
  fi
  echo -e "${txtyellow}Cloning the BenRevo repos into src...${txtreset}"
  mkdir -p src
  mkdir -p src/broker
  mkdir -p src/broker/proxy
  mkdir -p src/broker/fe
  mkdir -p src/broker/be
  mkdir -p src/superadmin
  mkdir -p src/superadmin/fe
  mkdir -p src/superadmin/be
  mkdir -p src/misc
  cd src/broker/be
  git clone https://github.com/BenRevo/common-data-lib
  git clone https://github.com/BenRevo/data-persistence-lib
  git clone https://github.com/BenRevo/core-application-service
  cd ../proxy
  git clone https://github.com/BenRevo/reverse-proxy
  cd ../fe
  git clone https://github.com/BenRevo/benrevo-react
  cd ../../superadmin/fe
  git clone https://github.com/BenRevo/benrevo-admin-site
  cd ../be
  git clone https://github.com/BenRevo/benrevo-admin-service
  cd ../../misc
  git clone https://github.com/BenRevo/deploy-helper
  git clone https://github.com/BenRevo/users-admin
  cd ../../..
  echo -e "${txtgreen}Finished.  BenRevo repos are now in ${txtreset}./src"
fi
