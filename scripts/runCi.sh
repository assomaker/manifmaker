BRANCH_NAME=$TRAVIS_BRANCH #$(git rev-parse --abbrev-ref HEAD)
echo branch name $BRANCH_NAME
if [[ $BRANCH_NAME = "production" ]];
then
  echo "=production="
  echo "... Now shipping " $MANIFMAKER_VERSION
  ssh root@vps302915.ovh.net "docker pull assomaker/manifmaker:$MANIFMAKER_VERSION"
  echo "... Now deploying to Production "
  ssh root@vps302915.ovh.net "cd manifmaker; git reset --hard HEAD; git pull origin production"
  ssh root@vps302915.ovh.net "cd manifmaker/production; sed -ie "s/_MAILGUN_PASSWORD_/$MAILGUN_PASSWORD/g" docker-compose.yml"
  ssh root@vps302915.ovh.net "cd manifmaker/production; docker-compose restart mongodb_backup"
  ssh root@vps302915.ovh.net "cd manifmaker/production; docker-compose up -d manifmaker"
fi 
if [[ $BRANCH_NAME = "deploy" ]];
then
  echo "=deploy="
  cd app
  echo "... Now building and delivering Docker image for " $MANIFMAKER_VERSION
  docker build -t assomaker/manifmaker:$MANIFMAKER_VERSION .
  docker push assomaker/manifmaker:$MANIFMAKER_VERSION
  echo "... Now shipping " $MANIFMAKER_VERSION
  ssh root@vps302914.ovh.net "docker pull assomaker/manifmaker:$MANIFMAKER_VERSION"
  echo "... Now deploying to PreProd "
  echo "!!! manifmaker repo need to be present AND production/docker-compose-preprod manifmaker image tag should be identical to app/package.json verion !!!"
  ssh root@vps302914.ovh.net "cd manifmaker; git reset --hard HEAD; git pull origin deploy"
  ssh root@vps302914.ovh.net "cd manifmaker/production; docker-compose --file docker-compose-preprod.yml up -d manifmaker"
  echo "... Now restoring most recent backup from production"
  ssh root@vps302914.ovh.net "docker exec mongodb_backup /restore.sh /backup/prod_latest"
fi 