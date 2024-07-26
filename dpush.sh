export AWS_PROFILE=ind

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 555239517161.dkr.ecr.us-east-1.amazonaws.com
#$(aws ecr get-login-password --region us-east-1)
docker tag myaibot/stablediffusion:latest 555239517161.dkr.ecr.us-east-1.amazonaws.com/myaibot:stablediffusion-0.2
docker push 555239517161.dkr.ecr.us-east-1.amazonaws.com/myaibot:stablediffusion-0.2
