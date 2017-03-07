FROM  mhart/alpine-node:latest

MAINTAINER yangsj <guobayang@gmail.com>

ADD MeetingTable /meetingtable

WORKDIR /meetingtable

RUN npm install --production && npm cache clean

EXPOSE 3000

CMD ["node", "/meetingtable/bin/www"]
