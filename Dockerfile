FROM node:10.15.1
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app
COPY package.json package-lock.json $HOME/capstone_api/
RUN  chown -R app:app $HOME/
USER app
WORKDIR $HOME/capstone_api
COPY .  $HOME/capstone_api
USER root 
RUN npm install --silent --progress=false && chown -R app:app $HOME/* 
USER app
EXPOSE 4000
CMD [ "npm","run","start:dev"]