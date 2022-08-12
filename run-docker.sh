docker run -d -v $CERT_PATH:/etc/nginx/certs/uchinokakeibo.xyz -p 80:80 -p 443:443 kmalexandre/uchinokakeibo:$KAKEIBO_TAG
