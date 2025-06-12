FROM mcr.microsoft.com/powershell:latest

# Instalar kubectl e zabbix_sender
RUN apt-get update && \
    apt-get install -y curl zabbix-sender && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

COPY script.ps1 /app/script.ps1

CMD ["pwsh", "/app/script.ps1"]
