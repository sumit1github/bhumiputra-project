#!/bin/bash

cd ~/app

git pull origin master

# for django
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
supervisorctl restart django

# for react

sudo cp -r /home/ubuntu/dist/* /var/www/myapp/
sudo systemctl restart nginx