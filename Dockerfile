FROM python:3.11

RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_lts.20.15.1| bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y npm

# Verify installation
RUN node --version
RUN npm --version
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app
COPY --chown=user . $HOME/app
COPY ./requirements.txt ~/app/requirements.txt
RUN pip install -r requirements.txt
COPY . .

USER root
WORKDIR $HOME/app/frontend
RUN npm install -g pnpm
RUN npm install
RUN npm audit fix
RUN pnpm run build
RUN chown -R user:user $HOME/app/frontend
RUN chown -R user:user $HOME/app/backend
USER user

# Change back to app directory
WORKDIR $HOME/app
EXPOSE 5173
EXPOSE 8080 
CMD ["/bin/bash", "-c", "./run.sh"]