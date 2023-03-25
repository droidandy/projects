echo '.\n.\n.'
cd ~
echo '----------------------------------------Installing Homebrew'
echo '.\n.\n.'
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Installing Java 8'
echo '.\n.\n.'
brew tap caskroom/versions
brew cask install java8
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Installing Maven'
echo '.\n.\n.'
brew install maven
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Installing IntelliJ'
echo '.\n.\n.'
brew cask install caskroom/cask/intellij-idea-ce
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Running mvn to generate .m2 directory and creating settings.xml at ~/.m2 (please ask a team-member for credentials!)'
echo '.\n.\n.'
mvn
touch ~/.m2/settings.xml
echo '<settings>
  <servers>
    <server>
      <id>s3.snapshot</id>
      <username>***REMOVED***</username>
      <password>***REMOVED***</password>
    </server>
  </servers>
</settings>' > ~/.m2/settings.xml
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Installing awscli'
echo '.\n.\n.'
brew install awscli
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Running aws configure'
echo '.\n.\n.'
aws configure
echo '.\n.\n.\n.\n.'
echo '----------------------------------------Cloning all backend benrevo github repositories into ~/IdeaProjects'
echo '.\n.\n.'
mkdir ~/IdeaProjects
cd ~/IdeaProjects
echo ‘Cloning all backend benrevo github repositories into ~/GitHub’
git clone https://github.com/BenRevo/common-data-lib.git
git clone https://github.com/BenRevo/data-persistence-lib.git
git clone https://github.com/BenRevo/be-modules.git
git clone https://github.com/BenRevo/core-application-service.git
git clone https://github.com/BenRevo/benrevo-admin-service.git
git clone https://github.com/BenRevo/be-dashboards-service.git
echo '.\n.\n.\n.\n.'
echo 'Done!'
