# SSH and GIT setup

```
ssh-keygen

cat ~/.ssh/id_ed25519.pub
```
then copy the ssh key to git ssh key

# Before runnig the play book
need to run and connect manually via ssh

`**Note` : if you are using the passbased auth
```
sudo apt-get update
sudo apt-get install sshpass
```

```
ssh root@143.110.253.200
<enter_password>
```

# env_var setup
### create .env file

there should be` no space before and after "="`

```
SERVER_PASS=KAKASUMIT1KOKO
SERVER_IP=143.110.253.200
SERVER_USERNAME=root


DB_NAME=bhumiputra
DB_USER=bhumiputra
DB_PASSWORD=KAKASUMIT1KOKO
```

### load all env vars in ram

need to run each time if there is chnages in .env

```
set -a
source .env
set +a

echo $SERVER_IP
echo $SERVER_PASS

```


# server setup

### install packages

``` ansible-playbook -i inventory.yml 1_setup.yml ```

### setup databases

``` ansible-playbook -i inventory.yml 2_db_setup.yml ```

### git setup and code pull for first time

``` ansible-playbook -i inventory.yml 3_codepull.yml ```