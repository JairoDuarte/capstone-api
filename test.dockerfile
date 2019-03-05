FROM node:10.15.1
RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app
COPY package.json package-lock.json $HOME/capstone_api/
RUN  chown -R app:app $HOME/
RUN apt update && apt -qqy install gdebi-core && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && gdebi -n google-chrome-stable_current_amd64.deb 
USER app
WORKDIR $HOME/capstone_api
COPY .  $HOME/capstone_api
USER root 
RUN npm install && chown -R app:app $HOME/*
USER app
EXPOSE 4000
CMD [ "npm","run","start:dev"]