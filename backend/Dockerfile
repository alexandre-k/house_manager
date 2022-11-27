FROM golang:latest

RUN mkdir /app
WORKDIR /app

EXPOSE 3001

RUN curl -fLo install.sh https://raw.githubusercontent.com/cosmtrek/air/master/install.sh \
    && chmod +x install.sh && sh install.sh && cp ./bin/air /bin/air

COPY . .

RUN go mod download

CMD air