aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 696056185562.dkr.ecr.us-east-1.amazonaws.com
#$(aws ecr get-login-password --region us-east-1)
docker tag my/stablediffusion:latest 696056185562.dkr.ecr.us-east-1.amazonaws.com/my/stablediffusion:0.2
docker push 696056185562.dkr.ecr.us-east-1.amazonaws.com/my/stablediffusion:0.2
