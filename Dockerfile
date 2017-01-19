FROM  mhart/alpine-node:latest

MAINTAINER yangsj <guobayang@gmail.com>

ADD ConferenceTable /conferencetable

WORKDIR /conferencetable

RUN npm install --production && npm cache clean

EXPOSE 3000

CMD ["node", "/conferencetable/bin/www"]
